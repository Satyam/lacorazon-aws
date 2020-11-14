import React, { useMemo } from 'react';

import { Table, TabContent, Nav, NavItem, NavLink } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';

import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useSalidas } from 'App/salidas/common';
import { useVentas } from 'App/ventas/common';
import { useConsignas } from 'App/consigna/common';
import configs from 'App/config/';
import { ShowVendedor } from 'App/vendedores/gadgets';
import { ShowDistribuidor } from 'App/distribuidor/gadgets';
import { useIntl } from 'Providers/Intl';
import { cuentas, ShowCuenta } from 'App/cuentas/gadgets';
import classnames from 'classnames';

enum Origen {
  Venta = 'Venta',
  Distribuidor = 'Distribuidor',
  Salida = 'Gasto',
}

type EntradaDeCaja = {
  fecha: Date;
  origen: Origen;
  referencia: string;
  concepto: string;
  importe: number;
  cuenta: string;
  iva: number;
  importeSinIVA: number;
  saldo?: number;
  acumIVA?: number;
};

const useAcumVentas = () => {
  const [ventas, loading, error] = useVentas();

  return useMemo(() => {
    if (loading) return;

    if (error) throw error;
    if (typeof ventas === 'undefined')
      throw Error('Tabla de ventas está vacía');

    const factorPrecioSinIva = 1 + configs.IVALibros;

    return ventas
      .filter((venta) => venta.precioUnitario && venta.cantidad)
      .map((venta) => {
        const precio = (venta.precioUnitario || 0) * (venta.cantidad || 0);
        var precioSinIVA = venta.iva ? precio / factorPrecioSinIva : precio;

        return {
          fecha: venta.fecha,
          origen: Origen.Venta,
          referencia: venta.idVendedor,
          concepto: venta.concepto,
          importe: precio,
          cuenta: venta.cuenta,
          iva: precio - precioSinIVA || '',
          importeSinIVA: precioSinIVA,
        } as EntradaDeCaja;
      });
  }, [ventas, loading, error]);
};

const useAcumSalidas = () => {
  const [salidas, loading, error] = useSalidas();

  return useMemo(() => {
    if (loading) return;

    if (error) throw error;
    if (typeof salidas === 'undefined')
      throw new Error('Tabla de salidas está vacía');
    return salidas.map(
      ({
        importe,
        iva = 0,
        reintegro,
        pagoiva,
        idVendedor,
        fecha,
        concepto,
        cuenta,
      }) => {
        if (
          (iva ? 1 : 0) +
            (reintegro ? 1 : 0) +
            (pagoiva ? 1 : 0) +
            (idVendedor ? 1 : 0) >
          1
        ) {
          throw new Error(`
            En Salidas para la fecha ${fecha} no puede haber más de uno: 
            IVA, Reintegro, Pago IVA o Comision en una misma entrada`);
        }

        var importeSinIVA = importe / (1 + iva);

        return {
          fecha,
          origen: Origen.Salida,
          referencia: reintegro
            ? 'Reintegro'
            : pagoiva
            ? 'Pago IVA'
            : idVendedor
            ? 'Comisión ' + idVendedor
            : '',
          concepto: concepto,
          importe: -importe,
          cuenta: cuenta,
          iva: pagoiva ? -importe : -(importe - importeSinIVA) || '',
          importeSinIVA: pagoiva ? 0 : -importeSinIVA,
        } as EntradaDeCaja;
      }
    );
  }, [salidas, loading, error]);
};

const useAcumConsigna = () => {
  const [consignas, loading, error] = useConsignas();

  return useMemo(() => {
    if (loading) return;

    if (error) throw error;
    if (typeof consignas === 'undefined')
      throw new Error('Tabla de consignas está vacía');
    const factorPrecioSinIva = 1 + configs.IVALibros;

    return consignas
      .filter((consigna) => consigna.cobrado)
      .map(({ cobrado, nroFactura, fecha, idDistribuidor, cuenta }) => {
        const cobradoSinIVA = nroFactura
          ? cobrado / factorPrecioSinIva
          : cobrado;

        return {
          fecha: fecha,
          origen: Origen.Distribuidor,
          referencia: idDistribuidor,
          concepto: nroFactura
            ? nroFactura + ' de ' + idDistribuidor
            : idDistribuidor,
          importe: cobrado,
          cuenta: cuenta,
          iva: cobrado - cobradoSinIVA || '',
          importeSinIVA: cobradoSinIVA,
        } as EntradaDeCaja;
      });
  }, [consignas, loading, error]);
};
const SumarioCaja: React.FC = () => {
  const history = useHistory();
  const { year } = useParams<{ year: string }>();
  const acumVentas = useAcumVentas();
  const acumSalidas = useAcumSalidas();
  const acumConsigna = useAcumConsigna();

  const { formatCurrency, formatDate } = useIntl();

  if (!acumSalidas || !acumVentas || !acumConsigna)
    return <Loading>Cargando datos</Loading>;

  let saldo = 0;
  let acumIVA = 0;
  let total = 0;
  const totalesPorCuenta: Record<string, number> = Object.keys(cuentas).reduce(
    (tots, cta) => ({
      ...tots,
      [cta]: 0,
    }),
    {}
  );

  const entradas: EntradaDeCaja[] = acumSalidas
    .concat(acumVentas, acumConsigna)
    .sort(
      (a: EntradaDeCaja, b: EntradaDeCaja) =>
        a.fecha.getTime() - b.fecha.getTime()
    )
    .map((entrada) => {
      // this part could have been done in a separate forEach()
      saldo += entrada.importeSinIVA;
      acumIVA += entrada.iva || 0;
      totalesPorCuenta[entrada.cuenta] += entrada.importe || 0;
      total += entrada.importe || 0;

      // this part does alter entrada
      entrada.saldo = saldo;
      entrada.acumIVA = acumIVA;
      return entrada;
    });

  const years = [];
  const minYear = entradas[0].fecha.getFullYear();
  const maxYear = entradas[entradas.length - 1].fecha.getFullYear();
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y);
  }

  const activeYear = year ? parseInt(year, 10) : maxYear;

  const rowSumario = (sumario: EntradaDeCaja) => {
    return (
      <tr key={`${sumario.fecha}-${sumario.importe}-${sumario.concepto}`}>
        <td>{formatDate(sumario.fecha)}</td>
        <td>{sumario.origen}</td>
        <td>
          {sumario.origen === Origen.Venta ? (
            <ShowVendedor idVendedor={sumario.referencia} />
          ) : sumario.origen === Origen.Distribuidor ? (
            <ShowDistribuidor idDistribuidor={sumario.referencia} />
          ) : (
            sumario.referencia
          )}
        </td>
        <td>{sumario.concepto}</td>
        <td align="right">{formatCurrency(sumario.importe)}</td>
        <td>
          <ShowCuenta idCuenta={sumario.cuenta} />
        </td>
        <td align="right">{formatCurrency(sumario.iva)}</td>
        <td align="right">{formatCurrency(sumario.importeSinIVA)}</td>
        <td align="right">{formatCurrency(sumario.saldo)}</td>
        <td align="right">{formatCurrency(sumario.acumIVA)}</td>
      </tr>
    );
  };

  return (
    <Page wide title="Sumario Distribuidores" heading="Sumario Distribuidores">
      <>
        <Table bordered size="sm" style={{ width: '40%', marginLeft: '30%' }}>
          <tbody>
            <tr
              title={`
Este es el importe que debe haber 
concretamente entre los dos sobres. 
Abajo figura lo que debe tener cada 
uno en su caja/sobre/cuenta
            `}
            >
              <th>Total</th>
              <td align="right">{formatCurrency(total)}</td>
            </tr>
            {Object.keys(totalesPorCuenta).map((idCuenta) => (
              <tr key={idCuenta}>
                <th>{cuentas[idCuenta].descr}</th>
                <td align="right">
                  {formatCurrency(totalesPorCuenta[idCuenta])}
                </td>
              </tr>
            ))}
            <tr title="Esta es la parte del sobre que es realmente vuestra">
              <th>Total despues del IVA</th>
              <td align="right">{formatCurrency(saldo)}</td>
            </tr>
            <tr
              title={`
Este es el IVA que se le debe a Hacienda.  
Si es negativo es que Hacienda os debe a vosotros`}
            >
              <th>IVA pendiente</th>
              <td align="right">{formatCurrency(acumIVA)}</td>
            </tr>
          </tbody>
        </Table>

        <Nav tabs>
          {years.map((y) => (
            <NavItem key={y}>
              <NavLink
                className={classnames({ active: activeYear === y })}
                onClick={() => {
                  history.replace(`/sumario/caja/${y}`);
                }}
              >
                {y}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <TabContent>
          <Table striped hover size="sm" responsive bordered>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Origen</th>
                <th>Referencia</th>
                <th>Concepto</th>
                <th>Total (IVA incluido)</th>
                <th>Cuenta</th>
                <th>IVA</th>
                <th>Importe (sin IVA)</th>
                <th>Saldo</th>
                <th>IVA Acum</th>
              </tr>
            </thead>
            <tbody>
              {entradas
                .filter(
                  (entrada: EntradaDeCaja) =>
                    entrada.fecha.getFullYear() === activeYear
                )
                .map(rowSumario)}
            </tbody>
          </Table>
        </TabContent>
      </>
    </Page>
  );
};

export default SumarioCaja;
