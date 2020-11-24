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
  ButtonIconEdit,
  ButtonIconDelete,
  ButtonIconAdd,
} from 'Components/Icons';

import { useIntl } from 'Providers/Intl';
import { Loading } from 'Components/Modals';
import Page from 'Components/Page';
import ErrorAlert from 'Components/ErrorAlert';
import { useModals } from 'Providers/Modals';

import { useGastos, deleteGasto } from './common';
import { ShowCuenta } from 'App/cuentas/gadgets';
import { ShowIVA, calculoIVA } from 'App/iva/gadgets';

const ListGastos: React.FC<{}> = () => {
  const history = useHistory();
  const { year } = useParams<{ year: string }>();

  const [gastos, loading, error] = useGastos();

  const { formatDate, formatCurrency } = useIntl();
  const { confirmDelete } = useModals();

  if (loading) return <Loading>Cargando gastos</Loading>;

  if (error) return <ErrorAlert error={error}>Cargando gastos</ErrorAlert>;
  if (typeof gastos === 'undefined') return null;

  const minYear = gastos[0].fecha.getFullYear();
  const maxYear = gastos[gastos.length - 1].fecha.getFullYear();
  const years = [];
  if (Array.isArray(gastos)) {
    for (let y = minYear; y <= maxYear; y++) {
      years.push(y);
    }
  }

  const activeYear: number = year ? parseInt(year, 10) : maxYear;
  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push('/gasto/new');
  };
  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { fecha, id } = ev.currentTarget.dataset;
    if (id && fecha) {
      confirmDelete(`la gasto del ${fecha}`, async () => await deleteGasto(id));
    }
  };
  const onEdit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push(`/gasto/edit/${ev.currentTarget.dataset.id}`);
  };

  const rowGasto = (gasto: GastoType) => {
    const idGasto = gasto.idGasto;
    const importe = gasto.importe;
    const porcIva: number = gasto.iva || 0;
    const { importeSinIva, importeIva } = calculoIVA(importe, porcIva);
    return (
      <tr key={idGasto}>
        <td align="right">
          <Link title="Ver detalle esta gasto" to={`/gasto/${idGasto}`}>
            {formatDate(gasto.fecha)}
          </Link>
        </td>
        <td>{gasto.concepto}</td>

        <td align="right">{formatCurrency(importe)}</td>
        <td>
          <ShowCuenta idCuenta={gasto.cuenta} />
        </td>
        <td align="right">
          <ShowIVA iva={porcIva} />
        </td>
        <td align="right">{formatCurrency(importeIva)}</td>
        <td align="right">{formatCurrency(importeSinIva)}</td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit
              outline
              onClick={onEdit}
              data-id={idGasto}
              data-fecha={formatDate(new Date(gasto.fecha))}
            />
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={idGasto}
              data-fecha={formatDate(new Date(gasto.fecha))}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Page
      title="Gastos"
      heading="Gastos"
      error={error}
      action={
        <ButtonIconAdd outline onClick={onAdd}>
          Agregar
        </ButtonIconAdd>
      }
    >
      <Nav tabs>
        {years.map((y) => (
          <NavItem key={y}>
            <NavLink
              className={classnames({ active: activeYear === y })}
              onClick={() => {
                history.replace(`/gastos/${y}`);
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
              <th>Concepto</th>
              <th>Importe</th>
              <th>Cuenta</th>
              <th>IVA%</th>
              <th>Importe IVA</th>
              <th>Importe sin IVA</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(gastos || [])
              .filter(
                (gasto: GastoType) => gasto.fecha.getFullYear() === activeYear
              )
              .map(rowGasto)}
          </tbody>
        </Table>
      </TabContent>
    </Page>
  );
};

export default ListGastos;
