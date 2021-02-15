import React from 'react';

import { Table, ButtonGroup } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import ErrorAlert from 'Components/ErrorAlert';
import Loading from 'Components/Modals/Loading';
import Page from 'Components/Page';

import {
  ButtonIconCobrar,
  ButtonIconInvoice,
  IconInfo,
} from '@satyam/react-form';

import { useIntl } from 'Providers/Intl';
import {
  useSumarioDistribuidores,
  SumarioPorDistribuidor,
} from 'App/distribuidor/useSumarioDistribuidores';

const ListadoPendientes: React.FC = () => {
  const [sumario = [], loading, error] = useSumarioDistribuidores();
  const history = useHistory();
  const { formatCurrency } = useIntl();

  if (error) return <ErrorAlert error={error}>Cargando datos</ErrorAlert>;
  if (loading) return <Loading>Cargando datos</Loading>;

  const pendientes = sumario.filter((s) => s.porFacturar > 0);

  const onFacturar: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { id, ...rest } = ev.currentTarget.dataset;
    history.push(`/facturar/${id}`, rest);
  };

  const onCobrar: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { id, ...rest } = ev.currentTarget.dataset;
    history.push(`/cobrar/${id}`, rest);
  };

  const rowPendiente = (sumario: SumarioPorDistribuidor) => {
    const idDistribuidor = sumario.idDistribuidor;
    const porcentaje = sumario.porcentaje;
    return (
      <tr key={idDistribuidor}>
        <td>{sumario.nombre}</td>
        <td align="right">
          {porcentaje
            ? porcentaje > 1
              ? formatCurrency(porcentaje)
              : `${porcentaje * 100}%`
            : ''}
        </td>
        <td align="right">{sumario.vendidos - sumario.cantFacturados}</td>
        <td align="right">{formatCurrency(sumario.porFacturar)}</td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconInvoice
              outline
              onClick={onFacturar}
              data-id={idDistribuidor}
              data-porcentaje={porcentaje}
              data-cantidad={sumario.vendidos - sumario.cantFacturados}
              data-importe={sumario.porFacturar}
              data-idvendedor={sumario.idVendedor}
            />
            <ButtonIconCobrar
              outline
              onClick={onCobrar}
              data-id={idDistribuidor}
              data-porcentaje={porcentaje}
              data-cantidad={sumario.vendidos - sumario.cantFacturados}
              data-importe={sumario.porFacturar}
              data-idvendedor={sumario.idVendedor}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Page
      title="Pendientes de facturar"
      heading="Listado Pendientes de cobro o facturación"
    >
      {loading && <Loading>Cargando datos</Loading>}
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th>Distribuidor</th>
            <th>
              <span style={{ float: 'left' }}>
                Porcentaje o<br />
                Precio Fijo
              </span>
              <span
                style={{ float: 'right' }}
                title={`
Este es el porcentaje 
o precio fijo por libro
acordado más recientemente
con el distribuidor`}
              >
                <IconInfo />
              </span>
            </th>
            <th>
              Unidades
              <br />
              pendientes
            </th>
            <th>
              <span style={{ float: 'left' }}>
                Importe
                <br />
                pendiente
              </span>
              <span
                style={{ float: 'right' }}
                title={`
Este importe está calculado 
en función del porcentaje 
o precio fijo por libro que se 
muestra a la izquierda`}
              >
                <IconInfo />
              </span>
            </th>
            <th />
          </tr>
        </thead>
        <tbody>{pendientes.map(rowPendiente)}</tbody>
      </Table>
    </Page>
  );
};

export default ListadoPendientes;
