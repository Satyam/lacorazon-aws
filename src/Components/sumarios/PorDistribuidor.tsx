import React from 'react';

import { Table, Alert } from 'reactstrap';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useDistribuidores } from 'Components/distribuidor/common';
import { useSalidas } from 'Components/salidas/common';
import { useVentas } from 'Components/ventas/common';
import { useConsignas } from 'Components/consigna/common';
import { useConfigs } from 'Components/config/common';
import { useIntl } from 'Providers/Intl';

type SumarioPorDistribuidor = {
  idDistribuidor: ID;
  nombre: string;
  entregados: number;
  vendidos: number;
  devueltos: number;
  existencias: number;
  facturado: number;
  aCobrar: number;
  porcentaje: number;
  cobrado: number;
};

const SumarioDistribuidores: React.FC = () => {
  const [
    distribuidores,
    loadingDistribuidores,
    errorDistribuidores,
  ] = useDistribuidores();
  const [salidas, loadingSalidas, errorSalidas] = useSalidas();
  const [ventas, loadingVentas, errorVentas] = useVentas();
  const [consignas, loadingConsigna, errorConsigna] = useConsignas();
  const [configs, loadingConfigs, errorConfigs] = useConfigs();

  const { formatCurrency } = useIntl();

  if (
    loadingDistribuidores ||
    loadingSalidas ||
    loadingVentas ||
    loadingConsigna ||
    loadingConfigs
  )
    return <Loading>Cargando datos</Loading>;

  if (typeof salidas === 'undefined')
    return <Alert color="warning">Tabla de salidas está vacía</Alert>;
  if (typeof consignas === 'undefined')
    return <Alert color="warning">Tabla de consignas está vacía</Alert>;
  if (typeof configs === 'undefined')
    return <Alert color="warning">Tabla de config está vacía</Alert>;
  if (typeof ventas === 'undefined')
    return <Alert color="warning">Tabla de ventas está vacía</Alert>;
  if (typeof distribuidores === 'undefined')
    return <Alert color="warning">Tabla de distribuidores está vacía</Alert>;

  const { PVP, comisionEstandar } = configs;
  const sumarioDistribuidores = distribuidores.reduce<
    Record<ID, SumarioPorDistribuidor>
  >(
    (vvs, v) => ({
      ...vvs,
      [v.idDistribuidor]: {
        idDistribuidor: v.idDistribuidor,
        nombre: v.nombre,

        entregados: 0,
        vendidos: 0,
        devueltos: 0,
        existencias: 0,
        facturado: 0,
        aCobrar: 0,
        porcentaje: comisionEstandar,
        cobrado: 0,
      },
    }),
    {}
  );

  consignas.forEach(({ idDistribuidor, ...consigna }) => {
    const sumario = sumarioDistribuidores[idDistribuidor];
    if (!sumario)
      throw new Error(`Código de Distribuidor "${idDistribuidor}" desconocido`);
    sumario.entregados += consigna.entregados || 0;

    let porcentaje = consigna.porcentaje;
    if (typeof porcentaje === 'undefined')
      porcentaje = sumario.porcentaje || comisionEstandar;
    else sumario.porcentaje = porcentaje;

    sumario.vendidos += consigna.vendidos || 0;

    sumario.devueltos += consigna.devueltos || 0;

    const facturado = consigna.facturado || 0;
    sumario.facturado += facturado;

    sumario.aCobrar = PVP * sumario.vendidos * (1 - porcentaje) - facturado;
    sumario.cobrado += consigna.cobrado || 0;

    sumario.existencias =
      sumario.entregados - sumario.vendidos - sumario.devueltos;
  });

  const totales = Object.values(sumarioDistribuidores).reduce<
    SumarioPorDistribuidor
  >(
    (totales, sumario) => ({
      ...totales,
      entregados: totales.entregados + sumario.entregados,
      vendidos: totales.vendidos + sumario.vendidos,
      devueltos: totales.devueltos + sumario.devueltos,
      existencias: totales.existencias + sumario.existencias,
      facturado: totales.facturado + sumario.facturado,
      aCobrar: totales.aCobrar + sumario.aCobrar,
      cobrado: totales.cobrado + sumario.cobrado,
    }),
    {
      idDistribuidor: '',
      nombre: '',

      entregados: 0,
      vendidos: 0,
      devueltos: 0,
      existencias: 0,
      facturado: 0,
      aCobrar: 0,
      porcentaje: comisionEstandar,
      cobrado: 0,
    }
  );
  const rowSumario = (sumario: SumarioPorDistribuidor) => {
    const idDistribuidor = sumario.idDistribuidor;
    return (
      <tr key={idDistribuidor}>
        <td>{sumario.nombre}</td>
        <td align="right">{sumario.entregados}</td>
        <td align="right">{sumario.vendidos}</td>
        <td align="right">{sumario.devueltos}</td>
        <td align="right">{sumario.existencias}</td>
        <td
          align="right"
          style={
            sumario.porcentaje !== comisionEstandar
              ? { fontWeight: 'bold' }
              : {}
          }
        >
          {sumario.porcentaje * 100}%
        </td>
        <td align="right">{formatCurrency(sumario.aCobrar)}</td>
        <td align="right">{formatCurrency(sumario.facturado)}</td>
        <td align="right">{formatCurrency(sumario.cobrado)}</td>
      </tr>
    );
  };

  return (
    <Page
      wide
      title="Sumario Distribuidores"
      heading="Sumario Distribuidores"
      error={
        errorDistribuidores?.message ||
        errorSalidas?.message ||
        errorVentas?.message ||
        errorConsigna?.message ||
        errorConfigs?.message
      }
    >
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th>Distribuidor</th>
            <th>Entregados</th>
            <th>Vendidos</th>
            <th>Devueltos</th>
            <th>Existencias</th>
            <th>Porcentaje</th>
            <th>Por cobrar</th>
            <th>Facturado</th>
            <th>Cobrado</th>
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
            <td></td>
            <td align="right">{formatCurrency(totales.aCobrar)}</td>
            <td align="right">{formatCurrency(totales.facturado)}</td>
            <td align="right">{formatCurrency(totales.cobrado)}</td>
          </tr>
        </tbody>
        <tbody>{Object.values(sumarioDistribuidores).map(rowSumario)}</tbody>
      </Table>
    </Page>
  );
};

export default SumarioDistribuidores;
