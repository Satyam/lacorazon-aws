import React, { useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import {
  Table,
  ButtonGroup,
  TabContent,
  Nav,
  NavItem,
  NavLink,
  Alert,
  ButtonDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';

import classnames from 'classnames';
import { ButtonIconEdit, ButtonIconDelete } from 'Components/Icons';
import { FaPlusCircle } from 'react-icons/fa';

import { useIntl } from 'Providers/Intl';
import { Loading } from 'Components/Modals';
import Page from 'Components/Page';
import { useModals } from 'Providers/Modals';
import { ShowCategoria } from 'App/salidas/gadgets';

import {
  useSalidas,
  deleteSalida,
  GASTO,
  REINTEGRO,
  PAGO_IVA,
  COMISION,
} from './common';
import { ShowCuenta } from 'App/cuentas/gadgets';

const AddDropdown: React.FC<{}> = () => {
  const history = useHistory();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { operacion } = ev.currentTarget.dataset;
    history.push(`/salida/new/${operacion}`);
  };
  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret color="primary" outline>
        <FaPlusCircle /> Agregar
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem data-operacion={GASTO} onClick={onAdd}>
          Gasto
        </DropdownItem>
        <DropdownItem data-operacion={REINTEGRO} onClick={onAdd}>
          Reintegro
        </DropdownItem>
        <DropdownItem data-operacion={PAGO_IVA} onClick={onAdd}>
          Pago Iva
        </DropdownItem>
        <DropdownItem data-operacion={COMISION} onClick={onAdd}>
          Pago Comisión
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

const ListSalidas: React.FC<{}> = () => {
  const history = useHistory();
  const { year } = useParams<{ year: string }>();

  const [salidas, loading, error] = useSalidas();

  const { formatDate, formatCurrency } = useIntl();
  const { confirmDelete } = useModals();

  if (loading) return <Loading>Cargando salidas</Loading>;

  if (error) return <Alert color="danger">{error.message}</Alert>;
  if (typeof salidas === 'undefined') return null;

  const minYear = salidas[0].fecha.getFullYear();
  const maxYear = salidas[salidas.length - 1].fecha.getFullYear();
  const years = [];
  if (Array.isArray(salidas)) {
    for (let y = minYear; y <= maxYear; y++) {
      years.push(y);
    }
  }

  const activeYear: number = year ? parseInt(year, 10) : maxYear;

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { fecha, id } = ev.currentTarget.dataset;
    if (id && fecha) {
      confirmDelete(
        `la salida del ${fecha}`,
        async () => await deleteSalida(id)
      );
    }
  };
  const onEdit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    history.push(`/salida/edit/${ev.currentTarget.dataset.id}`);
  };

  const rowSalida = (salida: SalidaType) => {
    const idSalida = salida.idSalida;
    const importe = salida.importe;
    const porcIva: number = salida.iva || 0;
    const importeSinIva: number = importe / (1 + porcIva);
    const importeIva: number = importe - importeSinIva;
    return (
      <tr key={idSalida}>
        <td align="right">
          <Link title="Ver detalle esta salida" to={`/salida/${idSalida}`}>
            {formatDate(salida.fecha)}
          </Link>
        </td>
        <td>{salida.concepto}</td>
        <td>
          <ShowCategoria {...salida} />
        </td>
        <td align="right">{formatCurrency(importe)}</td>
        <td>
          <ShowCuenta idCuenta={salida.cuenta} />
        </td>
        <td align="right">{porcIva ? `${porcIva * 100}%` : ''}</td>
        <td align="right">{formatCurrency(importeIva)}</td>
        <td align="right">{formatCurrency(importeSinIva)}</td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit
              outline
              onClick={onEdit}
              data-id={idSalida}
              data-fecha={formatDate(new Date(salida.fecha))}
            />
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={idSalida}
              data-fecha={formatDate(new Date(salida.fecha))}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Page
      title="Salidas"
      heading="Salidas"
      action={<AddDropdown />}
      error={error}
    >
      <Nav tabs>
        {years.map((y) => (
          <NavItem key={y}>
            <NavLink
              className={classnames({ active: activeYear === y })}
              onClick={() => {
                history.replace(`/salidas/${y}`);
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
              <th>Categoría</th>
              <th>Importe</th>
              <th>Cuenta</th>
              <th>IVA%</th>
              <th>Importe IVA</th>
              <th>Importe sin IVA</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(salidas || [])
              .filter(
                (salida: SalidaType) =>
                  salida.fecha.getFullYear() === activeYear
              )
              .map(rowSalida)}
          </tbody>
        </Table>
      </TabContent>
    </Page>
  );
};

export default ListSalidas;
