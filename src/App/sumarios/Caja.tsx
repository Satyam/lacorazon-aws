import React, { useMemo } from 'react';

import { Table } from 'reactstrap';

import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';

import { useGastos } from 'App/Gastos/common';
import { useVentas } from 'App/ventas/common';
import { useFacturaciones } from 'App/facturacion/common';
import configs from 'App/config/';
import { ShowVendedor } from 'App/vendedores/gadgets';
import { ShowDistribuidor } from 'App/distribuidor/gadgets';
import { useIntl } from 'Providers/Intl';
import { cuentas, ShowCuenta } from 'App/cuentas/gadgets';
import { YearTabs } from 'Components/gadgets';
enum Origen {
  Venta = 'Venta',
  Distribuidor = 'Distribuidor',
  Gasto = 'Gasto',
  Reintegro = 'Reintegro',
  PagoIVA = 'Pago de IVA',
  Comision = 'Comisión',
}

type EntradaDeCaja = {
  fecha: Date;
  origen: Origen;
  referencia: string;
  concepto: string;
  idVendedor: string;
  importe: number;
  cuenta: string;
  iva: number;
  importeSinIVA: number;
  saldo?: number;
  acumIVA?: number;
};

const useAcumVentas = (): [
  entradas: EntradaDeCaja[] | undefined,
  loading: boolean,
  error?: any
] => {
  const [ventas = [], loading, error] = useVentas();

  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, loading];

    const factorPrecioSinIva = 1 + configs.IVALibros;

    return [
      ventas
        .filter((venta) => venta.precioUnitario && venta.cantidad)
        .map((venta) => {
          const precio = (venta.precioUnitario || 0) * (venta.cantidad || 0);
          var precioSinIVA = venta.iva ? precio / factorPrecioSinIva : precio;

          return {
            fecha: venta.fecha,
            origen: Origen.Venta,
            idVendedor: venta.idVendedor,
            concepto: venta.concepto,
            importe: precio,
            cuenta: venta.cuenta,
            iva: precio - precioSinIVA || '',
            importeSinIVA: precioSinIVA,
          } as EntradaDeCaja;
        }),
      false,
    ];
  }, [ventas, loading, error]);
};

const useAcumGastos = (): [
  entradas: EntradaDeCaja[] | undefined,
  loading: boolean,
  error?: any
] => {
  const [gastos = [], loading, error] = useGastos();

  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, loading];

    return [
      gastos.map(({ importe, iva = 0, ...rest }) => {
        var importeSinIVA = importe / (1 + iva);

        return {
          origen: Origen.Gasto,
          referencia: '',
          importe: -importe,
          iva: -(importe - importeSinIVA) || '',
          importeSinIVA: -importeSinIVA,
          idVendedor: '',
          ...rest,
        } as EntradaDeCaja;
      }),
      false,
    ];
  }, [gastos, loading, error]);
};

const useAcumFacturacion = (): [
  entradas: EntradaDeCaja[] | undefined,
  loading: boolean,
  error?: any
] => {
  const [facturaciones = [], loading, error] = useFacturaciones();

  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, loading];

    const factorPrecioSinIva = 1 + configs.IVALibros;

    return [
      facturaciones
        .filter((facturacion) => facturacion.cobrado)
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
        }),
      false,
    ];
  }, [facturaciones, loading, error]);
};

const SumarioCaja: React.FC = () => {
  const [acumVentas = [], loadingVentas, errorVentas] = useAcumVentas();
  const [acumGastos = [], loadingGastos, errorGastos] = useAcumGastos();
  const [
    acumFacturacion = [],
    loadingFacturacion,
    errFacturacion,
  ] = useAcumFacturacion();

  const { formatCurrency, formatDate } = useIntl();
  if (errorVentas)
    return <ErrorAlert error={errorVentas}>Cargando ventas</ErrorAlert>;
  if (errorGastos)
    return <ErrorAlert error={errorGastos}>Cargando gastos</ErrorAlert>;
  if (errFacturacion)
    return <ErrorAlert error={errFacturacion}>Cargando facturación</ErrorAlert>;

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

  const entradas: EntradaDeCaja[] = acumGastos
    .concat(acumVentas, acumFacturacion)
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

  const rowSumario = (sumario: EntradaDeCaja) => {
    return (
      <tr key={`${sumario.fecha}-${sumario.importe}-${sumario.concepto}`}>
        <td>{formatDate(sumario.fecha)}</td>
        <td>{sumario.origen}</td>
        <td>
          {sumario.idVendedor && (
            <ShowVendedor idVendedor={sumario.idVendedor} />
          )}
          {sumario.origen === Origen.Distribuidor && (
            <ShowDistribuidor idDistribuidor={sumario.referencia} />
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
    <Page wide title="Caja" heading="Caja">
      <>
        {loadingGastos && <Loading>Cargando gastos</Loading>}
        {loadingVentas && <Loading>Cargando ventas</Loading>}
        {loadingFacturacion && <Loading>Cargando facturación</Loading>}

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

        <YearTabs list={entradas}>
          {(activeYear: number) => (
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
          )}
        </YearTabs>
      </>
    </Page>
  );
};

export default SumarioCaja;
