import { useMemo } from 'react';

import { useDistribuidores } from 'App/distribuidor/common';
import { useConsignas } from 'App/consigna/common';
import { useFacturaciones } from 'App/facturacion/common';
import configs from 'App/config/';

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
  idVendedor: ID;
};

export type SumarioPorDistribuidor = Distribuidor &
  AcumConsigna &
  AcumFacturacion & {
    porFacturar: number;
    porCobrar: number;
  };

const useInitDistribuidores = (): [
  distribuidores: Record<ID, Distribuidor> | undefined,
  loading: boolean,
  error?: Error | string
] => {
  const [distribuidores, loading, error] = useDistribuidores();

  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, loading];
    if (typeof distribuidores === 'undefined')
      return [undefined, false, 'Tabla de distribuidores está vacía'];
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
      false,
    ];
  }, [distribuidores, loading, error]);
};

const useAcumConsigna = (): [
  acumConsigna: Record<ID, AcumConsigna> | undefined,
  loading: boolean,
  error?: Error | string
] => {
  const [consignas, loading, error] = useConsignas();
  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, loading];
    if (typeof consignas === 'undefined')
      return [undefined, true, 'Tabla de consignas está vacía'];
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
      false,
    ];
  }, [consignas, loading, error]);
};

const useAcumFacturacion = (): [
  comisionPagada: Record<ID, AcumFacturacion> | undefined,
  loading: boolean,
  error?: Error | string
] => {
  const [facturaciones, loading, error] = useFacturaciones();
  return useMemo(() => {
    if (error) return [undefined, false, error];
    if (loading) return [undefined, loading];
    if (typeof facturaciones === 'undefined')
      return [undefined, true, 'Tabla de facturaciones está vacía'];
    const porcentajes: Record<ID, number> = {};

    return [
      facturaciones.reduce<Record<ID, AcumFacturacion>>(
        (
          acum,
          { idDistribuidor, porcentaje, facturado = 0, cobrado = 0, idVendedor }
        ) => {
          const sumario: AcumFacturacion = acum[idDistribuidor] || {
            facturado: 0,
            porcentaje: 0,
            cobrado: 0,
          };
          const pct = porcentaje || porcentajes[idDistribuidor];
          porcentajes[idDistribuidor] = pct;
          sumario.porcentaje = pct;
          sumario.facturado += facturado;
          sumario.cobrado += cobrado;
          sumario.idVendedor = idVendedor || sumario.idVendedor;
          return {
            ...acum,
            [idDistribuidor]: sumario,
          };
        },
        {}
      ),
      false,
    ];
  }, [facturaciones, loading, error]);
};

export const useSumarioDistribuidores = (): [
  sumarioDistribuidores: SumarioPorDistribuidor[] | undefined,
  loading: boolean,
  error?: Error | string
] => {
  const [
    distribuidores = {},
    loadingDistribuidores,
    errorDistribuidores,
  ] = useInitDistribuidores();
  const [acumConsigna = {}, loadingConsigna, errorConsigna] = useAcumConsigna();
  const [
    acumFacturacion = {},
    loadingFacturacion,
    errorFacturacion,
  ] = useAcumFacturacion();
  return useMemo(() => {
    const error = errorDistribuidores || errorConsigna || errorFacturacion;
    if (error) return [undefined, false, error];
    const loading =
      loadingDistribuidores || loadingConsigna || loadingFacturacion;
    if (loading) return [undefined, loading, undefined];

    const { PVP } = configs;

    const idDistribuidores = Object.keys(distribuidores)
      .concat(Object.keys(acumConsigna), Object.keys(acumFacturacion))
      .filter((value, index, self) => self.indexOf(value) === index);

    return [
      Object.values(
        idDistribuidores.reduce<Record<ID, SumarioPorDistribuidor>>(
          (sumario, idDistribuidor) => {
            const consigna = acumConsigna[idDistribuidor];
            const facturacion = acumFacturacion[idDistribuidor];
            let porFacturar = 0;
            let porCobrar = 0;

            if (consigna && facturacion) {
              const porcentaje = facturacion?.porcentaje || 0;
              if (porcentaje > 1) {
                porFacturar =
                  (consigna.vendidos - consigna.cantFacturados) * porcentaje;
              } else {
                porFacturar =
                  PVP *
                  (consigna.vendidos - consigna.cantFacturados) *
                  (1 - porcentaje);
              }
              porFacturar -= facturacion.cobrado;
              if (porFacturar < 0) porFacturar = 0;
              porCobrar =
                (facturacion.facturado || porFacturar) - facturacion.cobrado;
              if (porCobrar < 0) porCobrar = 0;
            }
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
                  porcentaje: 0,
                  cobrado: 0,
                },
                distribuidores[idDistribuidor],
                consigna,
                facturacion,
                {
                  porFacturar,
                  porCobrar,
                }
              ),
            };
          },
          {}
        )
      ),
      false,
      undefined,
    ];
  }, [
    distribuidores,
    loadingDistribuidores,
    errorDistribuidores,
    acumConsigna,
    loadingConsigna,
    errorConsigna,
    acumFacturacion,
    loadingFacturacion,
    errorFacturacion,
  ]);
};

export default useSumarioDistribuidores;
