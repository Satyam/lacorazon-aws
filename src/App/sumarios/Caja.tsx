import React from 'react';

import { Table, Alert } from 'reactstrap';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useSalidas } from 'App/salidas/common';
import { useVentas } from 'App/ventas/common';
import { useConsignas } from 'App/consigna/common';
import { useConfigs } from 'App/config/common';
import { ShowVendedor } from 'App/vendedores/gadgets';
import { ShowDistribuidor } from 'App/distribuidor/gadgets';
import { useIntl } from 'Providers/Intl';
import { Checkmark } from 'Components/Icons';

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
  ctaRaed: boolean;
  iva: number;
  importeSinIVA: number;
  saldo?: number;
  acumIVA?: number;
};

const SumarioCaja: React.FC = () => {
  const [salidas, loadingSalidas, errorSalidas] = useSalidas();
  const [ventas, loadingVentas, errorVentas] = useVentas();
  const [consignas, loadingConsigna, errorConsigna] = useConsignas();
  const [configs, loadingConfigs, errorConfigs] = useConfigs();

  const { formatCurrency, formatDate } = useIntl();

  if (loadingSalidas || loadingVentas || loadingConsigna || loadingConfigs)
    return <Loading>Cargando datos</Loading>;

  if (typeof salidas === 'undefined')
    return <Alert color="warning">Tabla de salidas está vacía</Alert>;
  if (typeof consignas === 'undefined')
    return <Alert color="warning">Tabla de consignas está vacía</Alert>;
  if (typeof configs === 'undefined')
    return <Alert color="warning">Tabla de config está vacía</Alert>;
  if (typeof ventas === 'undefined')
    return <Alert color="warning">Tabla de ventas está vacía</Alert>;

  const { IVALibros } = configs;

  const acumVentas = () => {
    const factorPrecioSinIva = 1 + IVALibros;

    return ventas
      ?.filter((venta) => venta.precioUnitario && venta.cantidad)
      .map((venta) => {
        const precio = (venta.precioUnitario || 0) * (venta.cantidad || 0);
        var precioSinIVA = venta.iva ? precio / factorPrecioSinIva : precio;

        return {
          fecha: venta.fecha,
          origen: Origen.Venta,
          referencia: venta.idVendedor,
          concepto: venta.concepto,
          importe: precio,
          ctaRaed: false,
          iva: precio - precioSinIVA || '',
          importeSinIVA: precioSinIVA,
        } as EntradaDeCaja;
      });
  };

  const acumSalidas = () => {
    return salidas.map(
      ({
        importe,
        iva = 0,
        reintegro,
        pagoiva,
        idVendedor,
        fecha,
        concepto,
        ctaRaed,
      }) => {
        if (
          (iva ? 1 : 0) +
            (reintegro ? 1 : 0) +
            (pagoiva ? 1 : 0) +
            (idVendedor ? 1 : 0) >
          1
        ) {
          throw new Error(
            'En Salidas para la fecha ' +
              formatDate(fecha) +
              ' no puede haber más de uno: IVA, Reintegro, Pago IVA o Comision en una misma entrada'
          );
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
          ctaRaed: ctaRaed,
          iva: pagoiva ? -importe : -(importe - importeSinIVA) || '',
          importeSinIVA: pagoiva ? 0 : -importeSinIVA,
        } as EntradaDeCaja;
      }
    );
  };

  const acumConsigna = () => {
    var factorPrecioSinIva = 1 + IVALibros;

    return consignas
      .filter((consigna) => consigna.cobrado)
      .map(({ cobrado, nroFactura, fecha, idDistribuidor, ctaRaed }) => {
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
          ctaRaed: ctaRaed,
          iva: cobrado - cobradoSinIVA || '',
          importeSinIVA: cobradoSinIVA,
        } as EntradaDeCaja;
      });
  };
  let saldo = 0;
  let acumIVA = 0;
  let caja = 0;
  let ctaRaed = 0;

  const entradas: EntradaDeCaja[] = acumSalidas()
    .concat(acumVentas(), acumConsigna())
    .sort(
      (a: EntradaDeCaja, b: EntradaDeCaja) =>
        a.fecha.getTime() - b.fecha.getTime()
    )
    .map((entrada) => {
      saldo += entrada.importeSinIVA;
      acumIVA += entrada.iva || 0;
      if (entrada.ctaRaed) ctaRaed += entrada.importe || 0;
      else caja += entrada.importe || 0;
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
        <td align="center">
          <Checkmark value={sumario.ctaRaed} />
        </td>
        <td align="right">{formatCurrency(sumario.iva)}</td>
        <td align="right">{formatCurrency(sumario.importeSinIVA)}</td>
        <td align="right">{formatCurrency(sumario.saldo)}</td>
        <td align="right">{formatCurrency(sumario.acumIVA)}</td>
      </tr>
    );
  };

  return (
    <Page
      wide
      title="Sumario Distribuidores"
      heading="Sumario Distribuidores"
      error={
        errorSalidas?.message ||
        errorVentas?.message ||
        errorConsigna?.message ||
        errorConfigs?.message
      }
    >
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
              <td align="right">{formatCurrency(ctaRaed + caja)}</td>
            </tr>
            <tr>
              <th>Cuenta Raed:</th>
              <td align="right">{formatCurrency(ctaRaed)}</td>
            </tr>
            <tr>
              <th>Caja:</th>
              <td align="right">{formatCurrency(caja)}</td>
            </tr>
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

        <Table striped hover size="sm" responsive bordered>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Origen</th>
              <th>Referencia</th>
              <th>Concepto</th>
              <th>Total (IVA incluido)</th>
              <th>Cuenta Raed</th>
              <th>IVA</th>
              <th>Importe (sin IVA)</th>
              <th>Saldo</th>
              <th>IVA Acum</th>
            </tr>
          </thead>
          <tbody>{entradas.map(rowSumario)}</tbody>
        </Table>
      </>
    </Page>
  );
};

export default SumarioCaja;
