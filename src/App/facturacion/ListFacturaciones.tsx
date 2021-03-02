import React from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { Table, ButtonGroup } from 'reactstrap';

import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
  ButtonIconView,
  IconView,
} from '@bit/satyam.components.icons-and-buttons';
import { useIntl } from '@bit/satyam.components.intl-provider';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import Page from 'Components/Page';
import { useModals } from 'Providers/Modals';
import { ShowVendedor } from 'App/vendedores/gadgets';
import { ShowDistribuidor } from 'App/distribuidor/gadgets';
import { useFacturaciones, deleteFacturacion } from './common';
import { ShowCuenta } from 'App/cuentas/gadgets';
import { YearTabs, hasYear } from 'Components/gadgets';

const ListFacturaciones: React.FC<{
  idVendedor?: string;
  nombreVendedor?: string;
  wide?: boolean;
}> = ({ idVendedor, nombreVendedor, wide }) => {
  const history = useHistory<null>();
  const { year } = useParams<{ year: string }>();

  const [facturaciones = [], loading, error] = useFacturaciones();

  const { formatDate, formatCurrency } = useIntl();
  const { confirmDelete } = useModals();

  if (error)
    return <ErrorAlert error={error}>Cargando facturaciones</ErrorAlert>;

  const distribuidorFilter: string | undefined =
    year && !hasYear(history.location.pathname) ? year : undefined;

  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push('/facturacion/new');
  };

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { fecha, id } = ev.currentTarget.dataset;
    if (id && fecha) {
      confirmDelete(
        `la facturacion del ${fecha}`,
        async () => await deleteFacturacion(id)
      );
    }
  };
  const onEdit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push(`/facturacion/edit/${ev.currentTarget.dataset.id}`);
  };

  const onFilterDistr: React.MouseEventHandler<HTMLImageElement> = (ev) => {
    ev.stopPropagation();
    history.push(`/facturaciones/${ev.currentTarget.dataset.id}`);
  };

  const onViewAll: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push('/facturaciones');
  };
  const rowFacturacion = ({
    idFacturacion,
    idDistribuidor,
    fecha,
    concepto,
    idVendedor,
    porcentaje,
    facturado,
    iva,
    nroFactura,
    cobrado,
    cuenta,
    cantidad,
  }: FacturacionType) => {
    return (
      <tr key={idFacturacion}>
        <td>
          <ShowDistribuidor idDistribuidor={idDistribuidor} />
          <IconView
            style={{ float: 'right' }}
            onClick={onFilterDistr}
            title="Ver sólo este distribuidor"
            data-id={idDistribuidor}
            color="info"
          />
        </td>
        <td align="right">
          <Link
            title="Ver detalle esta facturacion"
            to={`/facturacion/${idFacturacion}`}
          >
            {formatDate(new Date(fecha))}
          </Link>
        </td>
        <td>{concepto}</td>
        <td>{idVendedor ? <ShowVendedor idVendedor={idVendedor} /> : null}</td>

        <td align="right">
          {porcentaje &&
            (porcentaje < 1
              ? `${porcentaje * 100}%`
              : formatCurrency(porcentaje))}
        </td>
        <td align="right">{cantidad}</td>
        <td>{nroFactura}</td>
        <td align="right">{iva ? `${iva * 100}%` : null}</td>
        <td align="right">{formatCurrency(facturado)}</td>
        <td align="right">{formatCurrency(cobrado)}</td>
        <td>
          <ShowCuenta idCuenta={cuenta} />
        </td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit
              outline
              onClick={onEdit}
              data-id={idFacturacion}
              data-fecha={formatDate(new Date(fecha))}
            />
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={idFacturacion}
              data-fecha={formatDate(new Date(fecha))}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Page
      title={idVendedor ? undefined : 'Facturaciones'}
      heading={
        nombreVendedor ? `Facturaciones de ${nombreVendedor}` : 'Facturaciones'
      }
      wide={wide}
      action={
        <ButtonGroup size="sm">
          {distribuidorFilter && (
            <ButtonIconView outline color="warning" onClick={onViewAll}>
              Ver todos
            </ButtonIconView>
          )}
          <ButtonIconAdd outline onClick={onAdd}>
            Agregar
          </ButtonIconAdd>
        </ButtonGroup>
      }
    >
      {loading && <Loading>Cargando facturaciones</Loading>}
      <YearTabs list={distribuidorFilter ? undefined : facturaciones}>
        {(activeYear?: number) => (
          <Table striped hover size="sm" responsive bordered>
            <thead>
              <tr>
                <th>Distribuidor</th>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Vendedor</th>
                <th>
                  Porcentaje /<br />
                  Precio
                </th>
                <th>Cantidad</th>
                <th>Nro. Factura</th>
                <th>IVA</th>
                <th>Facturado</th>
                <th>Cobrado</th>
                <th>Cuenta</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {facturaciones
                .filter((f: FacturacionType) => {
                  if (activeYear) return f.fecha.getFullYear() === activeYear;
                  if (distribuidorFilter)
                    return f.idDistribuidor === distribuidorFilter;
                  return true;
                })
                .map(rowFacturacion)}
            </tbody>
          </Table>
        )}
      </YearTabs>
    </Page>
  );
};

export default ListFacturaciones;
