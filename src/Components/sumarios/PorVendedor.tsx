import React from 'react';

import { Table, Alert } from 'reactstrap';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useSalidas } from 'Components/salidas/common';
import { useVentas } from 'Components/ventas/common';
import { useConsignas } from 'Components/consigna/common';
import { ShowVendedor } from 'Components/vendedores/gadgets';
import { useIntl } from 'Providers/Intl';

const COMISION_INTERNA = 0.25;
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
  const [salidas, loadingSalidas, errorSalidas] = useSalidas();
  const [ventas, loadingVentas, errorVentas] = useVentas();
  const [consignas, loadingConsigna, errorConsigna] = useConsignas();
  const { formatCurrency } = useIntl();

  if (loadingSalidas || loadingVentas || loadingConsigna)
    return <Loading>Cargando datos</Loading>;

  if (salidas) {
    const comisionesPagadasPorVendedor = salidas
      .filter((salida) => salida.idVendedor)
      .reduce<Record<string, any>>(
        (acumuladorComisionesPorVendedor, salida) => {
          const idVendedor = salida?.idVendedor || '';
          acumuladorComisionesPorVendedor[idVendedor] =
            (acumuladorComisionesPorVendedor[idVendedor] || 0) + salida.importe;
          return acumuladorComisionesPorVendedor;
        },
        {}
      );
    if (ventas) {
      const ventasVendedores: Record<ID, SumarioPorVendedor> = {};

      ventas.forEach(({ idVendedor = '??', precioUnitario, cantidad }) => {
        let acumVtasPorVendedor = ventasVendedores[idVendedor];

        if (!acumVtasPorVendedor) {
          acumVtasPorVendedor = {
            idVendedor,
            vendido: 0,
            regalado: 0,
            total: 0,
            precio: 0,
            comisionVD: 0,
            comisionEC: 0,
            comisionPagada: comisionesPagadasPorVendedor[idVendedor] || 0,
            promedio: 0,
          };
          ventasVendedores[idVendedor] = acumVtasPorVendedor;
        }

        acumVtasPorVendedor.total += cantidad;
        if (precioUnitario) {
          acumVtasPorVendedor.vendido += cantidad;
          acumVtasPorVendedor.precio += cantidad * precioUnitario;
          acumVtasPorVendedor.comisionVD +=
            cantidad * precioUnitario * COMISION_INTERNA;
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
      if (consignas) {
        consignas
          .filter((consigna) => consigna.facturado > 0 && consigna.idVendedor)
          .forEach(({ idVendedor, facturado }) => {
            ventasVendedores[idVendedor].comisionEC +=
              COMISION_INTERNA * facturado;
          });

        const totales = Object.values(ventasVendedores).reduce<
          SumarioPorVendedor
        >(
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
                {idVendedor === 'rora'
                  ? ''
                  : formatCurrency(sumario.comisionVD)}
              </td>
              <td align="right">
                {idVendedor === 'rora'
                  ? ''
                  : formatCurrency(sumario.comisionEC)}
              </td>
              <td align="right">
                {idVendedor === 'rora'
                  ? ''
                  : formatCurrency(-sumario.comisionPagada)}
              </td>
              <td align="right">
                {idVendedor === 'rora'
                  ? ''
                  : formatCurrency(
                      sumario.comisionVD +
                        sumario.comisionEC -
                        sumario.comisionPagada
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
              errorSalidas?.message ||
              errorVentas?.message ||
              errorConsigna?.message
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
      } else
        return <Alert color="warning">Tabla de consignas está vacía</Alert>;
    } else return <Alert color="warning">Tabla de ventas está vacía</Alert>;
  } else return <Alert color="warning">Tabla de salidas está vacía</Alert>;
};

export default SumarioVendedores;
