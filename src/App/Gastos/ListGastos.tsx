import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Table, ButtonGroup, TabContent } from 'reactstrap';

import {
  ButtonIconEdit,
  ButtonIconDelete,
  ButtonIconAdd,
} from 'Components/Icons';

import { useIntl } from 'Providers/Intl';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import Page from 'Components/Page';
import { useModals } from 'Providers/Modals';
import { YearTabs } from 'Components/gadgets';
import { useGastos, deleteGasto } from './common';
import { ShowCuenta } from 'App/cuentas/gadgets';
import { ShowIVA, calculoIVA } from 'App/iva/gadgets';

const ListGastos: React.FC<{}> = () => {
  const history = useHistory();

  const [gastos, loading, error] = useGastos();

  const { formatDate, formatCurrency } = useIntl();
  const { confirmDelete } = useModals();
  if (error) return <ErrorAlert error={error}>Cargando gastos</ErrorAlert>;

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
      action={
        <ButtonIconAdd outline onClick={onAdd}>
          Agregar
        </ButtonIconAdd>
      }
    >
      {loading && <Loading>Cargando gastos</Loading>}
      <YearTabs list={gastos}>
        {(activeYear: number) => (
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
                {gastos
                  .filter(
                    (gasto: GastoType) =>
                      gasto.fecha.getFullYear() === activeYear
                  )
                  .map(rowGasto)}
              </tbody>
            </Table>
          </TabContent>
        )}
      </YearTabs>
    </Page>
  );
};

export default ListGastos;
