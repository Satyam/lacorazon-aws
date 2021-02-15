import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Table, ButtonGroup } from 'reactstrap';

import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
  // } from '@satyam/react-form';
} from '@satyam/react-form';

import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';

import { useModals } from 'Providers/Modals';

import { deleteVendedor, useVendedores } from './common';

export default function ListVendedores() {
  const history = useHistory();
  const [vendedores = [], loading, error] = useVendedores();

  const { confirmDelete } = useModals();

  if (error) return <ErrorAlert error={error}>Cargando vendedores</ErrorAlert>;

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    const { nombre, id } = ev.currentTarget.dataset;
    if (!id) return;
    ev.stopPropagation();
    confirmDelete(`al vendedor ${nombre}`, () => deleteVendedor(id));
  };

  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push('/vendedor/new');
  };

  const rowVendedor = (vendedor: VendedorType) => {
    const idVendedor = vendedor.idVendedor;
    return (
      <tr key={idVendedor}>
        <td>
          <Link
            title={`Ver detalle:\n  ${vendedor.idVendedor}`}
            to={`/vendedor/${idVendedor}`}
          >
            {vendedor.idVendedor}
          </Link>
        </td>
        <td>{vendedor.nombre}</td>
        <td>{vendedor.email}</td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit outline href={`/vendedor/edit/${idVendedor}`} />
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={idVendedor}
              data-nombre={vendedor.nombre}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Page
      wide
      title="Vendedores"
      heading="Vendedores"
      action={
        <ButtonIconAdd outline onClick={onAdd}>
          Agregar
        </ButtonIconAdd>
      }
    >
      {loading && <Loading>Cargando vendedores</Loading>}
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th>Abreviatura</th>
            <th>Nombre</th>
            <th>e-Mail</th>
            <th />
          </tr>
        </thead>
        <tbody>{vendedores.map(rowVendedor)}</tbody>
      </Table>
    </Page>
  );
}
