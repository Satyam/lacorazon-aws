import React, { useMemo } from 'react';

import { Table } from 'reactstrap';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useDistribuidores } from 'App/distribuidor/common';
import { useConsignas } from 'App/consigna/common';
import { useFacturaciones } from 'App/facturacion/common';
import configs from 'App/config/';
import { useIntl } from 'Providers/Intl';

type SumarioPorDistribuidor = {
  idDistribuidor: ID;
  nombre: string;
  entregados: number;
  vendidos: number;
  devueltos: number;
  cantFacturados: number;
  existencias: number;
  facturado: number;
  aCobrar: number;
  porcentaje: number;
  cobrado: number;
};

type TablaSumario = Record<ID, SumarioPorDistribuidor>;

const useInitSumario = (): [ventasVendedores?: TablaSumario, error?: any] => {
  const [distribuidores, loading, error] = useDistribuidores();

  return useMemo(() => {
    if (error) return [undefined, error];
    if (loading) return [];
    if (typeof distribuidores === 'undefined')
      return [undefined, 'Tabla de distribuidores está vacía'];
    const { comisionEstandar } = configs;
    return [
      distribuidores.reduce<TablaSumario>(
        (vvs, v) => ({
          ...vvs,
          [v.idDistribuidor]: {
            idDistribuidor: v.idDistribuidor,
            nombre: v.nombre,

            entregados: 0,
            vendidos: 0,
            devueltos: 0,
            cantFacturados: 0,
            existencias: 0,
            facturado: 0,
            aCobrar: 0,
            porcentaje: comisionEstandar,
            cobrado: 0,
          },
        }),
        {}
      ),
    ];
  }, [distribuidores, loading, error]);
};

const useAcumConsigna = (sumarioDistribuidores?: TablaSumario) => {
  const [consignas, loading, error] = useConsignas();
  return useMemo(() => {
    if (typeof sumarioDistribuidores === 'undefined') return;
    if (error) return error;
    if (loading) return;
    if (typeof consignas === 'undefined')
      return 'Tabla de consignas está vacía';
    consignas.forEach(({ idDistribuidor, ...consigna }) => {
      const sumario = sumarioDistribuidores[idDistribuidor];
      if (!sumario)
        throw new Error(
          `Código de Distribuidor "${idDistribuidor}" desconocido`
        );

      switch (consigna.movimiento) {
        case 'entregados':
          sumario.entregados += consigna.cantidad;
          break;
        case 'vendidos':
          sumario.vendidos += consigna.cantidad;
          break;
        case 'devueltos':
          sumario.devueltos += consigna.cantidad;
          break;
        case 'facturados':
          sumario.cantFacturados += consigna.cantidad;
          break;
        default:
          throw new Error(
            `Movimiento desconocido en consigna: ${consigna.movimiento}`
          );
      }
      sumario.existencias =
        sumario.entregados - sumario.vendidos - sumario.devueltos;
    });
  }, [consignas, loading, error, sumarioDistribuidores]);
};

const useAcumFacturacion = (sumarioDistribuidores?: TablaSumario) => {
  const [facturaciones, loading, error] = useFacturaciones();
  return useMemo(() => {
    if (typeof sumarioDistribuidores === 'undefined') return;
    if (error) return error;
    if (loading) return;
    if (typeof facturaciones === 'undefined')
      return 'Tabla de facturaciones está vacía';
    const { PVP, comisionEstandar } = configs;

    facturaciones.forEach(({ idDistribuidor, ...facturacion }) => {
      const sumario = sumarioDistribuidores[idDistribuidor];
      if (!sumario)
        throw new Error(
          `Código de Distribuidor "${idDistribuidor}" desconocido`
        );

      let porcentaje = facturacion.porcentaje;
      if (typeof porcentaje === 'undefined')
        porcentaje = sumario.porcentaje || comisionEstandar;
      else sumario.porcentaje = porcentaje;

      const facturado = facturacion.facturado || 0;
      sumario.facturado += facturado;

      sumario.aCobrar = PVP * sumario.vendidos * (1 - porcentaje) - facturado;
      sumario.cobrado += facturacion.cobrado || 0;
    });
  }, [facturaciones, loading, error, sumarioDistribuidores]);
};

const SumarioDistribuidores: React.FC = () => {
  const [sumarioDistribuidores, error] = useInitSumario();
  let errors = [error];
  errors.push(useAcumConsigna(sumarioDistribuidores));
  errors.push(useAcumFacturacion(sumarioDistribuidores));

  const { formatCurrency } = useIntl();

  if (typeof sumarioDistribuidores === 'undefined')
    return <Loading>Cargando Datos</Loading>;
  if (Object.keys(sumarioDistribuidores).length === 0)
    return <Loading>Cargando datos</Loading>;
  const { comisionEstandar } = configs;

  const totales = Object.values(
    sumarioDistribuidores
  ).reduce<SumarioPorDistribuidor>(
    (totales, sumario) => ({
      ...totales,
      entregados: totales.entregados + sumario.entregados,
      vendidos: totales.vendidos + sumario.vendidos,
      devueltos: totales.devueltos + sumario.devueltos,
      existencias: totales.existencias + sumario.existencias,
      cantFacturados: totales.cantFacturados + sumario.cantFacturados,
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
      cantFacturados: 0,
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
        <td align="right">{sumario.cantFacturados}</td>
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
      error={errors}
    >
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th>Distribuidor</th>
            <th>Entregados</th>
            <th>Vendidos</th>
            <th>Devueltos</th>
            <th>Existencias</th>
            <th>
              Cantidad
              <br />
              Facturados
            </th>
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
            <td align="right">{totales.cantFacturados}</td>

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
