import React from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import {
  Table,
  ButtonGroup,
  TabContent,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import classnames from 'classnames';
import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
  ButtonIconView,
  IconView,
} from 'Components/Icons';
import { useIntl } from 'Providers/Intl';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import Page from 'Components/Page';
import { useModals } from 'Providers/Modals';
import { ShowVendedor } from 'App/vendedores/gadgets';
import { ShowDistribuidor } from 'App/distribuidor/gadgets';
import { useFacturaciones, deleteFacturacion } from './common';
import { ShowCuenta } from 'App/cuentas/gadgets';
import { yearTabs } from 'Components/utils';
const fourDigits = /\d{4}/;

const ListFacturaciones: React.FC<{
  idVendedor?: string;
  nombreVendedor?: string;
  wide?: boolean;
}> = ({ idVendedor, nombreVendedor, wide }) => {
  const history = useHistory();
  const { year } = useParams<{ year: string }>();

  const [facturaciones = [], loading, error] = useFacturaciones();

  const { formatDate, formatCurrency } = useIntl();
  const { confirmDelete } = useModals();

  if (error)
    return <ErrorAlert error={error}>Cargando facturaciones</ErrorAlert>;

  let activeYear: number | undefined;
  let years: number[] = [];

  let distribuidorFilter: string | undefined;
  if (!year || fourDigits.test(year)) {
    [years, activeYear] = yearTabs(facturaciones, year);
  } else {
    distribuidorFilter = year;
  }

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
      {activeYear && (
        <Nav tabs>
          {years.map((y) => (
            <NavItem key={y}>
              <NavLink
                className={classnames({ active: activeYear === y })}
                onClick={() => {
                  history.replace(`/facturaciones/${y}`);
                }}
              >
                {y}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      )}
      <TabContent>
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
      </TabContent>
    </Page>
  );
};

export default ListFacturaciones;
