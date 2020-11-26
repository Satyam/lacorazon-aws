import React from 'react';

import { Table, Alert } from 'reactstrap';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useVendedores } from 'App/vendedores/common';
import { useComisiones } from 'App/comisiones/common';
import { useVentas } from 'App/ventas/common';
import { useFacturaciones } from 'App/facturacion/common';
import configs from 'App/config/';
import { ShowVendedor } from 'App/vendedores/gadgets';
import { useIntl } from 'Providers/Intl';

type SumarioPorVendedor = {
  idVendedor: ID;
  vendido: number;
  regalado: number;
  total: number;
  precio: number;
  comisionVD: number;
  comisionEC: number;
  comisionPagada: number;
  promedio: number;
};

const SumarioVendedores: React.FC = () => {
  const [vendedores, loadingVendedores, errorVendedores] = useVendedores();
  const [comisiones, loadingComisiones, errorComisiones] = useComisiones();
  const [ventas, loadingVentas, errorVentas] = useVentas();
  const [
    facturaciones,
    loadingFacturacion,
    errorFacturacion,
  ] = useFacturaciones();

  const { formatCurrency } = useIntl();

  if (
    loadingVendedores ||
    loadingComisiones ||
    loadingVentas ||
    loadingFacturacion
  )
    return <Loading>Cargando datos</Loading>;

  if (typeof comisiones === 'undefined')
    return <Alert color="warning">Tabla de comisiones está vacía</Alert>;
  if (typeof facturaciones === 'undefined')
    return <Alert color="warning">Tabla de facturaciones está vacía</Alert>;
  if (typeof ventas === 'undefined')
    return <Alert color="warning">Tabla de ventas está vacía</Alert>;
  if (typeof vendedores === 'undefined')
    return <Alert color="warning">Tabla de vendedores está vacía</Alert>;

  const { comisionInterna } = configs;

  const ventasVendedores = vendedores.reduce<Record<ID, SumarioPorVendedor>>(
    (vvs, v) => ({
      ...vvs,
      [v.idVendedor]: {
        idVendedor: v.idVendedor,
        vendido: 0,
        regalado: 0,
        total: 0,
        precio: 0,
        comisionVD: 0,
        comisionEC: 0,
        comisionPagada: 0,
        promedio: 0,
      },
    }),
    {}
  );

  comisiones.forEach((comision) => {
    if (comision.idVendedor) {
      ventasVendedores[comision.idVendedor].comisionPagada += comision.importe;
    }
  });

  ventas.forEach(({ idVendedor = '??', precioUnitario, cantidad }) => {
    const acumVtasPorVendedor = ventasVendedores[idVendedor];

    acumVtasPorVendedor.total += cantidad;
    if (precioUnitario) {
      acumVtasPorVendedor.vendido += cantidad;
      acumVtasPorVendedor.precio += cantidad * precioUnitario;
      acumVtasPorVendedor.comisionVD +=
        cantidad * precioUnitario * comisionInterna;
    } else {
      acumVtasPorVendedor.regalado += cantidad;
    }
  });

  for (const v in ventasVendedores) {
    var row = ventasVendedores[v];
    if (row.vendido) {
      row.promedio = row.precio / row.vendido;
    }
  }
  facturaciones
    .filter(
      (facturacion) => facturacion.facturado > 0 && facturacion.idVendedor
    )
    .forEach(({ idVendedor, facturado }) => {
      ventasVendedores[idVendedor].comisionEC += comisionInterna * facturado;
    });

  const totales = Object.values(ventasVendedores).reduce<SumarioPorVendedor>(
    (totales, sumario) => ({
      ...totales,
      vendido: totales.vendido + sumario.vendido,
      regalado: totales.regalado + sumario.regalado,
      total: totales.total + sumario.total,
      precio: totales.precio + sumario.precio,
    }),
    {
      idVendedor: '',
      vendido: 0,
      regalado: 0,
      total: 0,
      precio: 0,
      comisionVD: 0,
      comisionEC: 0,
      comisionPagada: 0,
      promedio: 0,
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
        <td align="right">{formatCurrency(sumario.promedio)}</td>
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
    <Page
      wide
      title="Sumario Vendedores"
      heading="Sumario Vendedores"
      error={
        errorVendedores?.message ||
        errorComisiones?.message ||
        errorVentas?.message ||
        errorFacturacion?.message
      }
    >
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
        <tbody>{Object.values(ventasVendedores).map(rowSumario)}</tbody>
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
