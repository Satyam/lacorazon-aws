import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Table, ButtonGroup } from 'reactstrap';

import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
  Checkmark,
} from 'Components/Icons';
import { useIntl } from 'Providers/Intl';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import Page from 'Components/Page';
import { useModals } from 'Providers/Modals';
import { ShowVendedor } from 'App/vendedores/gadgets';
import { YearTabs } from 'Components/gadgets';
import { useVentas, deleteVenta } from './common';
import { ShowCuenta } from 'App/cuentas/gadgets';

const ListVentas: React.FC<{
  idVendedor?: string;
  nombreVendedor?: string;
  wide?: boolean;
}> = ({ idVendedor, nombreVendedor, wide }) => {
  const history = useHistory();

  const [ventas = [], loading, error] = useVentas();

  const { formatDate, formatCurrency } = useIntl();
  const { confirmDelete } = useModals();

  if (error) return <ErrorAlert error={error}>Cargando ventas</ErrorAlert>;

  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push('/venta/new');
  };

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { fecha, id } = ev.currentTarget.dataset;
    if (id && fecha) {
      confirmDelete(`la venta del ${fecha}`, async () => await deleteVenta(id));
    }
  };
  const onEdit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push(`/venta/edit/${ev.currentTarget.dataset.id}`);
  };

  const rowVenta = (venta: VentaType) => {
    const idVenta = venta.idVenta;
    return (
      <tr key={idVenta}>
        <td align="right">
          <Link title="Ver detalle esta venta" to={`/venta/${idVenta}`}>
            {formatDate(new Date(venta.fecha))}
          </Link>
        </td>
        <td>{venta.concepto}</td>
        {!idVendedor &&
          (venta.idVendedor ? (
            <td>
              <ShowVendedor idVendedor={venta.idVendedor} />
            </td>
          ) : (
            <td>---</td>
          ))}
        <td align="right">{venta.cantidad}</td>
        <td align="right">{formatCurrency(venta.precioUnitario)}</td>
        <td align="center">
          <Checkmark value={venta.iva} />
        </td>
        <td align="right">
          {formatCurrency(venta.cantidad! * venta.precioUnitario!)}
        </td>
        <td>
          <ShowCuenta idCuenta={venta.cuenta} />
        </td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit
              outline
              onClick={onEdit}
              data-id={idVenta}
              data-fecha={formatDate(new Date(venta.fecha))}
            />
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={idVenta}
              data-fecha={formatDate(new Date(venta.fecha))}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Page
      title={idVendedor ? undefined : 'Ventas'}
      heading={nombreVendedor ? `Ventas de ${nombreVendedor}` : 'Ventas'}
      wide={wide}
      action={
        <ButtonIconAdd outline onClick={onAdd}>
          Agregar
        </ButtonIconAdd>
      }
    >
      {loading && <Loading>Cargando ventas</Loading>}
      <YearTabs list={ventas}>
        {(activeYear: number) => (
          <Table striped hover size="sm" responsive bordered>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                {!idVendedor && <th>Vendedor</th>}
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>IVA</th>
                <th>Precio Total</th>
                <th>Cuenta</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ventas
                .filter(
                  (venta: VentaType) => venta.fecha.getFullYear() === activeYear
                )
                .map(rowVenta)}
            </tbody>
          </Table>
        )}
      </YearTabs>
    </Page>
  );
};

export default ListVentas;
