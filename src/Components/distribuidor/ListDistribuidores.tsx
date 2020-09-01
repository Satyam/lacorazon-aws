import React, { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Table, ButtonGroup } from 'reactstrap';

import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'Components/Icons';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useModals } from 'Providers/Modals';

import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.css';
import { selDistribuidores } from 'Store/distribuidores/selectors';
import {
  listDistribuidores,
  deleteDistribuidor,
} from 'Store/distribuidores/actions';
import { IDLE, LOADING } from 'Store/constants';

export default function ListDistribuidores() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { status, error, data: distribuidores } = useSelector(
    selDistribuidores
  );

  const { confirmDelete } = useModals();

  useEffect(() => {
    if (status === IDLE) dispatch(listDistribuidores());
  }, [dispatch, status]);

  if (status === LOADING) return <Loading>Cargando distribuidores</Loading>;

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    const { nombre, id } = ev.currentTarget.dataset;
    if (!id) return;
    ev.stopPropagation();
    confirmDelete(`al distribuidor ${nombre}`, () =>
      dispatch(deleteDistribuidor(id))
    );
  };
  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push('/distribuidor/new');
  };
  const rowDistribuidor = (distribuidor: DistribuidorType) => {
    const idDistribuidor = distribuidor.idDistribuidor;
    return (
      <tr key={idDistribuidor}>
        <td>
          <Link
            title={`Ver detalle:\n  ${distribuidor.nombre}`}
            to={`/distribuidor/${idDistribuidor}`}
          >
            {distribuidor.nombre}
          </Link>
        </td>
        <td>{distribuidor.contacto}</td>
        <td>{distribuidor.telefono}</td>
        <td>
          <div className={styles.small}>{distribuidor.direccion}</div>

          {distribuidor.localidad}
        </td>
        <td className={styles.small}>
          {(distribuidor.email || '').replace('@', '\n@')}
        </td>
        <td align="right">{distribuidor.entregados}</td>
        <td align="right">{distribuidor.existencias}</td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit
              outline
              href={`/distribuidor/edit/${idDistribuidor}`}
            />
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={idDistribuidor}
              data-nombre={distribuidor.nombre}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Page
      wide
      title="Distribuidores"
      heading="Distribuidores"
      action={
        <ButtonIconAdd outline onClick={onAdd}>
          Agregar
        </ButtonIconAdd>
      }
      error={error?.message}
    >
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>e-Mail</th>
            <th>Entregados</th>
            <th>Existencias</th>
            <th />
          </tr>
        </thead>
        <tbody>{(distribuidores || []).map(rowDistribuidor)}</tbody>
      </Table>
    </Page>
  );
}
