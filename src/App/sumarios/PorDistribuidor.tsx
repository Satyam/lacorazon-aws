import React, { useMemo } from 'react';

import { Table } from 'reactstrap';
import Page from 'Components/Page';
import { useDistribuidores } from 'App/distribuidor/common';
import { useConsignas } from 'App/consigna/common';
import { useFacturaciones } from 'App/facturacion/common';
import configs from 'App/config/';
import { useIntl } from 'Providers/Intl';

type Distribuidor = {
  idDistribuidor: ID;
  nombre: string;
};

type AcumConsigna = {
  entregados: number;
  vendidos: number;
  devueltos: number;
  cantFacturados: number;
  existencias: number;
};

type AcumFacturacion = {
  facturado: number;
  porcentaje: number;
  cobrado: number;
};

type SumarioPorDistribuidor = Distribuidor &
  AcumConsigna &
  AcumFacturacion & {
    porFacturar: number;
    porCobrar: number;
  };

const useInitDistribuidores = (): [
  distribuidores?: Record<ID, Distribuidor>,
  error?: Error | string
] => {
  const [distribuidores, loading, error] = useDistribuidores();

  return useMemo(() => {
    if (error) return [undefined, error];
    if (loading) return [];
    if (typeof distribuidores === 'undefined')
      return [undefined, 'Tabla de distribuidores está vacía'];
    return [
      distribuidores.reduce<Record<ID, Distribuidor>>(
        (vvs, v) => ({
          ...vvs,
          [v.idDistribuidor]: {
            idDistribuidor: v.idDistribuidor,
            nombre: v.nombre,
          },
        }),
        {}
      ),
    ];
  }, [distribuidores, loading, error]);
};

const useAcumConsigna = (): [
  acumConsigna?: Record<ID, AcumConsigna>,
  error?: Error | string
] => {
  const [consignas, loading, error] = useConsignas();
  return useMemo(() => {
    if (error) return [undefined, error];
    if (loading) return [];
    if (typeof consignas === 'undefined')
      return [undefined, 'Tabla de consignas está vacía'];
    return [
      consignas.reduce<Record<ID, AcumConsigna>>(
        (acum, { idDistribuidor, cantidad, movimiento }) => {
          const sumario: AcumConsigna = acum[idDistribuidor] || {
            entregados: 0,
            vendidos: 0,
            devueltos: 0,
            cantFacturados: 0,
            existencias: 0,
          };
          switch (movimiento) {
            case 'entregados':
              sumario.entregados += cantidad;
              break;
            case 'vendidos':
              sumario.vendidos += cantidad;
              break;
            case 'devueltos':
              sumario.devueltos += cantidad;
              break;
            case 'facturados':
              sumario.cantFacturados += cantidad;
              break;
            default:
              break;
          }
          sumario.existencias =
            sumario.entregados - sumario.vendidos - sumario.devueltos;
          return {
            ...acum,
            [idDistribuidor]: sumario,
          };
        },
        {}
      ),
    ];
  }, [consignas, loading, error]);
};

const useAcumFacturacion = (): [
  comisionPagada?: Record<ID, AcumFacturacion>,
  error?: Error | string
] => {
  const [facturaciones, loading, error] = useFacturaciones();
  return useMemo(() => {
    if (error) return [undefined, error];
    if (loading) return [];
    if (typeof facturaciones === 'undefined')
      return [undefined, 'Tabla de facturaciones está vacía'];
    const { comisionEstandar } = configs;
    const porcentajes: Record<ID, number> = {};

    return [
      facturaciones.reduce<Record<ID, AcumFacturacion>>(
        (acum, { idDistribuidor, porcentaje, facturado = 0, cobrado = 0 }) => {
          const sumario: AcumFacturacion = acum[idDistribuidor] || {
            facturado: 0,

            porcentaje: 0,
            cobrado: 0,
          };
          const pct =
            porcentaje || porcentajes[idDistribuidor] || comisionEstandar;
          porcentajes[idDistribuidor] = pct;
          sumario.porcentaje = pct;
          sumario.facturado += facturado;
          sumario.cobrado += cobrado;
          return {
            ...acum,
            [idDistribuidor]: sumario,
          };
        },
        {}
      ),
    ];
  }, [facturaciones, loading, error]);
};

const SumarioDistribuidores: React.FC = () => {
  const [distribuidores = {}, error1] = useInitDistribuidores();
  const [acumConsigna = {}, error2] = useAcumConsigna();
  const [acumFacturacion = {}, error3] = useAcumFacturacion();

  const { formatCurrency } = useIntl();

  const { PVP, comisionEstandar } = configs;

  const idDistribuidores = Object.keys(distribuidores)
    .concat(Object.keys(acumConsigna), Object.keys(acumFacturacion))
    .filter((value, index, self) => self.indexOf(value) === index);

  const sumarioDistribuidores = Object.values(
    idDistribuidores.reduce<Record<ID, SumarioPorDistribuidor>>(
      (sumario, idDistribuidor) => {
        const consigna = acumConsigna[idDistribuidor];
        const facturacion = acumFacturacion[idDistribuidor];
        // if (idDistribuidor === 'beatriz') {
        //   console.log(consigna, facturacion);
        // }
        return {
          ...sumario,
          [idDistribuidor]: Object.assign(
            {
              idDistribuidor: '',
              nombre: '',
              entregados: 0,
              vendidos: 0,
              devueltos: 0,
              cantFacturados: 0,
              existencias: 0,
              facturado: 0,
              porcentaje: comisionEstandar,
              cobrado: 0,
            },
            distribuidores[idDistribuidor],
            consigna,
            facturacion,
            {
              porFacturar:
                consigna && facturacion
                  ? PVP *
                    (consigna.vendidos - consigna.cantFacturados) *
                    (1 - facturacion.porcentaje)
                  : 0,
              porCobrar: facturacion
                ? facturacion.facturado - facturacion.cobrado
                : 0,
            }
          ),
        };
      },
      {}
    )
  );

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
      porcentaje: comisionEstandar,
      cobrado: 0,
      porCobrar: 0,
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
        <td align="right">{formatCurrency(sumario.porFacturar)}</td>
        <td align="right">{formatCurrency(sumario.facturado)}</td>
        <td align="right">{formatCurrency(sumario.cobrado)}</td>
        <td align="right">{formatCurrency(sumario.porCobrar)}</td>
      </tr>
    );
  };

  return (
    <Page
      wide
      title="Sumario Distribuidores"
      heading="Sumario Distribuidores"
      error={[error1, error2, error3]}
    >
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th rowSpan={2}>Distribuidor</th>
            <th colSpan={5}>Cantidades</th>
            <th rowSpan={2}>Porcentaje</th>
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
