import React from 'react';

import { Table } from 'reactstrap';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';

import {
  useSumarioDistribuidores,
  SumarioPorDistribuidor,
} from 'App/distribuidor/useSumarioDistribuidores';
import { useIntl } from 'Providers/Intl';

const SumarioDistribuidores: React.FC = () => {
  const [
    sumarioDistribuidores = [],
    loading,
    error,
  ] = useSumarioDistribuidores();
  const { formatCurrency } = useIntl();
  if (error) return <ErrorAlert error={error}>Cargando datos</ErrorAlert>;

  const totales = sumarioDistribuidores.reduce<SumarioPorDistribuidor>(
    (totales, sumario) => ({
      ...totales,
      entregados: totales.entregados + sumario.entregados,
      vendidos: totales.vendidos + sumario.vendidos,
      devueltos: totales.devueltos + sumario.devueltos,
      existencias: totales.existencias + sumario.existencias,
      cantFacturados: totales.cantFacturados + sumario.cantFacturados,
      facturado: totales.facturado + sumario.facturado,
      porFacturar: totales.porFacturar + sumario.porFacturar,
      cobrado: totales.cobrado + sumario.cobrado,
      porCobrar: totales.porCobrar + sumario.porCobrar,
    }),
    {
      idDistribuidor: '',
      nombre: '',

      entregados: 0,
      vendidos: 0,
      devueltos: 0,
      existencias: 0,
      cantFacturados: 0,
      facturado: 0,
      porFacturar: 0,
      porcentaje: 0,
      cobrado: 0,
      porCobrar: 0,
    }
  );
  const rowSumario = (sumario: SumarioPorDistribuidor) => {
    const idDistribuidor = sumario.idDistribuidor;
    const porcentaje = sumario.porcentaje;
    return (
      <tr key={idDistribuidor}>
        <td>{sumario.nombre}</td>
        <td align="right">{sumario.entregados}</td>
        <td align="right">{sumario.vendidos}</td>
        <td align="right">{sumario.devueltos}</td>
        <td align="right">{sumario.existencias}</td>
        <td align="right">{sumario.cantFacturados}</td>
        <td align="right">
          {porcentaje
            ? porcentaje > 1
              ? formatCurrency(porcentaje)
              : `${porcentaje * 100}%`
            : ''}
        </td>
        <td align="right">{formatCurrency(sumario.porFacturar)}</td>
        <td align="right">{formatCurrency(sumario.facturado)}</td>
        <td align="right">{formatCurrency(sumario.cobrado)}</td>
        <td align="right">{formatCurrency(sumario.porCobrar)}</td>
      </tr>
    );
  };

  return (
    <Page wide title="Sumario Distribuidores" heading="Sumario Distribuidores">
      {loading && <Loading>Cargando datos</Loading>}
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th rowSpan={2}>Distribuidor</th>
            <th colSpan={5}>Cantidades</th>
            <th rowSpan={2}>
              Porcentaje o<br />
              Precio Fijo
            </th>
            <th colSpan={4}>Importes</th>
          </tr>
          <tr>
            <th>Entregados</th>
            <th>Vendidos</th>
            <th>Devueltos</th>
            <th>Existencias</th>
            <th>Facturados</th>
            <th>Por Facturar</th>
            <th>Facturado</th>
            <th>Cobrado</th>
            <th>Por Cobrar</th>
          </tr>
        </thead>
        <tbody
          style={{ borderTop: 'silver double', borderBottom: 'silver double' }}
        >
          <tr>
            <th>Totales</th>
            <td align="right">{totales.entregados}</td>
            <td align="right">{totales.vendidos}</td>
            <td align="right">{totales.devueltos}</td>
            <td align="right">{totales.existencias}</td>
            <td align="right">{totales.cantFacturados}</td>

            <td></td>
            <td align="right">{formatCurrency(totales.porFacturar)}</td>
            <td align="right">{formatCurrency(totales.facturado)}</td>
            <td align="right">{formatCurrency(totales.cobrado)}</td>
            <td align="right">{formatCurrency(totales.porCobrar)}</td>
          </tr>
        </tbody>
        <tbody>
          {sumarioDistribuidores
            .sort((a, b) => {
              if (a.nombre < b.nombre) return -1;
              if (a.nombre > b.nombre) return 1;
              return 0;
            })
            .map(rowSumario)}
        </tbody>
      </Table>
    </Page>
  );
};

export default SumarioDistribuidores;
