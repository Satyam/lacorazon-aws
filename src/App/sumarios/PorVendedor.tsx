import React, { useMemo } from 'react';

import { Table } from 'reactstrap';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import { useVendedores } from 'App/vendedores/common';
import { useComisiones } from 'App/comisiones/common';
import { useVentas } from 'App/ventas/common';
import { useFacturaciones } from 'App/facturacion/common';
import configs from 'App/config/';
import { ShowVendedor } from 'App/vendedores/gadgets';
import { useIntl } from '@satyam/react-form';

type Vendedor = {
  idVendedor: ID;
};
type AcumComisionesPagadas = {
  comisionPagada: number;
};

type AcumVentas = {
  total: number;
  vendido: number;
  regalado: number;
  precio: number;
  comisionVD: number;
};

type AcumFacturacion = {
  comisionEC: number;
};

type SumarioPorVendedor = Vendedor &
  AcumComisionesPagadas &
  AcumVentas &
  AcumFacturacion;

const useInitVendedores = (): [
  vendedores: Record<ID, Vendedor> | undefined,
  loading: boolean,
  error?: Error | string
] => {
  const [vendedores = [], loading, error] = useVendedores();
  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, loading];
    return [
      vendedores.reduce<Record<ID, Vendedor>>(
        (vvs, v) => ({
          ...vvs,
          [v.idVendedor]: {
            idVendedor: v.idVendedor,
          },
        }),
        {}
      ),
      false,
    ];
  }, [vendedores, loading, error]);
};

const useAcumComisionesPagadas = (): [
  comisionPagada: Record<ID, AcumComisionesPagadas> | undefined,
  loading: boolean,
  error?: Error | string
] => {
  const [comisiones = [], loading, error] = useComisiones();
  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, loading];
    return [
      comisiones.reduce<Record<ID, AcumComisionesPagadas>>(
        (comisiones, { idVendedor, importe }) => {
          const pagadas = comisiones[idVendedor]?.comisionPagada || 0;
          return {
            ...comisiones,
            [idVendedor]: { comisionPagada: pagadas + importe },
          };
        },
        {}
      ),
      false,
    ];
  }, [comisiones, loading, error]);
};

const useAcumVentas = (): [
  ventas: Record<ID, AcumVentas> | undefined,
  loading: boolean,
  error?: Error | string
] => {
  const [ventas = [], loading, error] = useVentas();
  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, false];

    const { comisionInterna } = configs;
    return [
      ventas.reduce<Record<ID, AcumVentas>>(
        (
          acumVentas,
          { idVendedor = '', precioUnitario, cantidad, ...rest }
        ) => {
          const acumVtasPorVendedor: AcumVentas = acumVentas[idVendedor] || {
            total: 0,
            vendido: 0,
            regalado: 0,
            precio: 0,
            comisionVD: 0,
          };

          acumVtasPorVendedor.total += cantidad;
          if (precioUnitario) {
            acumVtasPorVendedor.vendido += cantidad;
            acumVtasPorVendedor.precio += cantidad * precioUnitario;
            acumVtasPorVendedor.comisionVD +=
              cantidad * precioUnitario * comisionInterna;
          } else {
            acumVtasPorVendedor.regalado += cantidad;
          }
          return {
            ...acumVentas,
            [idVendedor]: acumVtasPorVendedor,
          };
        },
        {}
      ),
      false,
    ];
  }, [ventas, loading, error]);
};

const useAcumFacturacion = (): [
  facturacion: Record<ID, AcumFacturacion> | undefined,
  loading: boolean,
  error?: Error | string
] => {
  const [facturaciones = [], loading, error] = useFacturaciones();
  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, loading];

    const { comisionInterna } = configs;
    return [
      facturaciones
        .filter(
          (facturacion) => facturacion.facturado && facturacion.idVendedor
        )
        .reduce<Record<ID, AcumFacturacion>>(
          (acumFacturacion, { idVendedor = '', facturado }) => {
            if (!facturado) return acumFacturacion;
            const acumFacturado: AcumFacturacion = acumFacturacion[
              idVendedor
            ] || {
              comisionEC: 0,
            };
            acumFacturado.comisionEC += comisionInterna * facturado;
            return {
              ...acumFacturacion,
              [idVendedor]: acumFacturado,
            };
          },
          {}
        ),
      false,
    ];
  }, [facturaciones, loading, error]);
};

const SumarioVendedores: React.FC = () => {
  const [
    vendedores = {},
    loadingVendedores,
    errorVendedores,
  ] = useInitVendedores();
  const [
    acumComisionesPagadas = {},
    loadingComisiones,
    errorComisiones,
  ] = useAcumComisionesPagadas();
  const [acumVentas = {}, loadingVentas, errorVentas] = useAcumVentas();
  const [
    acumFacturacion = {},
    loadingFacturacion,
    errorFacturacion,
  ] = useAcumFacturacion();
  const { formatCurrency } = useIntl();

  if (errorVendedores)
    return <ErrorAlert error={errorVendedores}>Cargando vendedores</ErrorAlert>;
  if (errorComisiones)
    return <ErrorAlert error={errorComisiones}>Cargando comisiones</ErrorAlert>;
  if (errorVentas)
    return <ErrorAlert error={errorVentas}>Cargando ventas</ErrorAlert>;
  if (errorFacturacion)
    return (
      <ErrorAlert error={errorFacturacion}>Cargando facturación</ErrorAlert>
    );

  const idVendedores = Object.keys(vendedores)
    .concat(
      Object.keys(acumComisionesPagadas),
      Object.keys(acumVentas),
      Object.keys(acumFacturacion)
    )
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  const ventasVendedores = Object.values(
    idVendedores.reduce<Record<ID, SumarioPorVendedor>>(
      (sumario, idVendedor) => ({
        ...sumario,
        [idVendedor]: Object.assign(
          {
            vendido: 0,
            regalado: 0,
            total: 0,
            precio: 0,
            comisionVD: 0,
            comisionEC: 0,
            comisionPagada: 0,
          },
          vendedores[idVendedor],
          acumComisionesPagadas[idVendedor],
          acumVentas[idVendedor],
          acumFacturacion[idVendedor]
        ),
      }),
      {}
    )
  );

  const totales = ventasVendedores.reduce<{
    vendido: number;
    regalado: number;
    total: number;
    precio: number;
  }>(
    (totales, sumario) => ({
      vendido: totales.vendido + sumario.vendido,
      regalado: totales.regalado + sumario.regalado,
      total: totales.total + sumario.total,
      precio: totales.precio + sumario.precio,
    }),
    {
      vendido: 0,
      regalado: 0,
      total: 0,
      precio: 0,
    }
  );

  const rowSumario = (sumario: SumarioPorVendedor) => {
    const idVendedor = sumario.idVendedor;
    return (
      <tr key={idVendedor}>
        <td align="right">
          <ShowVendedor idVendedor={idVendedor} />
        </td>
        <td align="right">{sumario.vendido}</td>
        <td align="right">{sumario.regalado}</td>
        <td align="right">{sumario.total}</td>
        <td align="right">{formatCurrency(sumario.precio)}</td>
        <td align="right">
          {sumario.vendido && formatCurrency(sumario.precio / sumario.vendido)}
        </td>
        <td align="right">
          {idVendedor === 'rora' ? '' : formatCurrency(sumario.comisionVD)}
        </td>
        <td align="right">
          {idVendedor === 'rora' ? '' : formatCurrency(sumario.comisionEC)}
        </td>
        <td align="right">
          {idVendedor === 'rora' ? '' : formatCurrency(-sumario.comisionPagada)}
        </td>
        <td align="right">
          {idVendedor === 'rora'
            ? ''
            : formatCurrency(
                sumario.comisionVD + sumario.comisionEC - sumario.comisionPagada
              )}
        </td>
      </tr>
    );
  };

  return (
    <Page wide title="Sumario Vendedores" heading="Sumario Vendedores">
      {loadingVendedores && <Loading>Cargando vendedores</Loading>}
      {loadingComisiones && <Loading>Cargando conmisiones</Loading>}
      {loadingVentas && <Loading>Cargando ventas</Loading>}
      {loadingFacturacion && <Loading>Cargando facturación</Loading>}
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th rowSpan={2}>Vendedor</th>
            <th colSpan={3}>Cantidades</th>
            <th colSpan={2}>Cobrado</th>
            <th colSpan={4}>Comisiones</th>
          </tr>
          <tr>
            <th>Vendidos</th>
            <th>Regalados</th>
            <th>Total</th>
            <th>Total</th>
            <th>Promedio por libro</th>
            <th>por Venta Directa</th>
            <th>por Distribuidores</th>
            <th>Pagada</th>
            <th>A Pagar</th>
          </tr>
        </thead>
        <tbody>{ventasVendedores.map(rowSumario)}</tbody>
        <tbody style={{ borderTop: 'silver double' }}>
          <tr>
            <th>Totales</th>
            <td align="right">{totales.vendido}</td>
            <td align="right">{totales.regalado}</td>
            <td align="right">{totales.total}</td>
            <td align="right">{formatCurrency(totales.precio)}</td>
            <td align="right">
              {formatCurrency(totales.precio / totales.vendido)}
            </td>
          </tr>
        </tbody>
      </Table>
    </Page>
  );
};

export default SumarioVendedores;
