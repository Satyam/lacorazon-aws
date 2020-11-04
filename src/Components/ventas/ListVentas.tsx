import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Table, ButtonGroup } from 'reactstrap';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';

import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'Components/Icons';
import { useIntl } from 'Providers/Intl';
import { Loading } from 'Components/Modals';
import Page from 'Components/Page';
import { useModals } from 'Providers/Modals';

import { useVentas, ventaRef } from './common';

const ListVentas: React.FC<{
  idVendedor?: string;
  nombreVendedor?: string;
  wide?: boolean;
}> = ({ idVendedor, nombreVendedor, wide }) => {
  const history = useHistory();

  const [ventas, loading, error] = useVentas();

  const { formatDate, formatCurrency } = useIntl();
  const { confirmDelete } = useModals();

  if (loading) return <Loading>Cargando ventas</Loading>;

  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push('/venta/new');
  };

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { fecha, id } = ev.currentTarget.dataset;
    if (id && fecha) {
      confirmDelete(
        `la venta del ${fecha}`,
        async () => await ventaRef(id).remove()
      );
    }
  };
  const onEdit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push(`/venta/edit/${ev.currentTarget.dataset.id}`);
  };
  const onShowVendedor: React.MouseEventHandler<HTMLElement> = (ev) => {
    ev.stopPropagation();
    history.push(`/user/${ev.currentTarget.dataset.id}`);
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
            <td
              className="link"
              onClick={onShowVendedor}
              data-id={venta.idVendedor}
              title={`Ver detalle vendedor: \n${venta.idVendedor}`}
            >
              {venta.idVendedor}
            </td>
          ) : (
            <td>---</td>
          ))}
        <td align="right">{venta.cantidad}</td>
        <td align="right">{formatCurrency(venta.precioUnitario)}</td>
        <td align="center">
          {venta.iva ? <FaRegCheckSquare /> : <FaRegSquare />}
        </td>
        <td align="right">
          {formatCurrency(venta.cantidad! * venta.precioUnitario!)}
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
      error={error}
    >
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
            <th />
          </tr>
        </thead>
        <tbody>{(ventas || []).map(rowVenta)}</tbody>
      </Table>
    </Page>
  );
};

export default ListVentas;
