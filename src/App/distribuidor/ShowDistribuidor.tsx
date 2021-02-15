import React from 'react';
import { Alert, Table } from 'reactstrap';
import { useParams } from 'react-router-dom';

import { LabeledText } from '@satyam/react-form';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import { useIntl } from '@satyam/react-form';
import { byFecha } from 'Components/utils';
import { useDistribuidor } from './common';
import { useConsignas } from 'App/consigna/common';
import { useFacturaciones } from 'App/facturacion/common';
import { ShowCuenta } from 'App/cuentas/gadgets';
import { ShowVendedor } from 'App/vendedores/gadgets';

import styles from './styles.module.css';
const ShowDetalle: React.FC<{ distribuidor: DistribuidorType }> = ({
  distribuidor,
}) => {
  const RowDetalle: React.FC<Partial<ConsignaType & FacturacionType>> = ({
    fecha,
    movimiento,
    idConsigna,
    idFacturacion,
    idDistribuidor,
    ...row
  }) => {
    const { formatDate, formatCurrency } = useIntl();
    const operacion = () => {
      switch (movimiento) {
        case 'entregados':
          return 'Entregados';
        case 'vendidos':
          return 'Vendidos';
        case 'devueltos':
          return 'Devueltos';
        case 'facturados':
          return 'Facturados';
        default:
          if (row.cobrado) return 'Cobrado';
          if (row.facturado) return 'Facturado';
          if (row.porcentaje) return 'Cambio términos';
          return JSON.stringify(row, null, 2);
      }
    };
    const resto = () => {
      if (movimiento)
        return (
          <ul className={styles.noDots}>
            <li>Cantidad: {row.cantidad}</li>
          </ul>
        );
      if (row.cobrado) {
        return (
          <ul className={styles.noDots}>
            {row.facturado && (
              <li>Facturado: {formatCurrency(row.facturado)}</li>
            )}
            <li>Cobrado: {formatCurrency(row.cobrado)}</li>
            <li>
              Cuenta: <ShowCuenta idCuenta={row.cuenta} />
            </li>
            {row.nroFactura && <li>Nro. Factura: {row.nroFactura}</li>}
            {row.idVendedor && (
              <li>
                Vendedor: <ShowVendedor idVendedor={row.idVendedor} />
              </li>
            )}
            {row.porcentaje && row.porcentaje >= 1 && (
              <li>Precio: {formatCurrency(row.porcentaje)}</li>
            )}
            {row.porcentaje && row.porcentaje < 1 && (
              <li>Porcentaje: {row.porcentaje * 100}%</li>
            )}
            {/* <li style={{ color: 'red' }}>
              {Object.keys(row)
                .filter(
                  (p) =>
                    ![
                      'facturado',
                      'cobrado',
                      'cuenta',
                      'nroFactura',
                      'idVendedor',
                      'porcentaje',
                    ].includes(p)
                )
                .join(' - ')}
            </li> */}
          </ul>
        );
      }
      if (row.facturado) {
        return (
          <ul className={styles.noDots}>
            <li>Facturado: {formatCurrency(row.facturado)}</li>
            {row.nroFactura && <li>Nro. Factura: {row.nroFactura}</li>}
            {row.idVendedor && (
              <li>
                Vendedor: <ShowVendedor idVendedor={row.idVendedor} />
              </li>
            )}
            {row.porcentaje && row.porcentaje >= 1 && (
              <li>Precio: {formatCurrency(row.porcentaje)}</li>
            )}
            {row.porcentaje && row.porcentaje < 1 && (
              <li>Porcentaje: {row.porcentaje * 100}%</li>
            )}
            {/* <li style={{ color: 'red' }}>
              {Object.keys(row)
                .filter(
                  (p) => !['facturado', 'nroFactura', 'porcentaje'].includes(p)
                )
                .join(' - ')}
            </li> */}
          </ul>
        );
      }
      if (row.porcentaje) {
        return (
          <ul className={styles.noDots}>
            {row.porcentaje >= 1 && (
              <li>Precio: {formatCurrency(row.porcentaje)}</li>
            )}
            {row.porcentaje < 1 && <li>Porcentaje: {row.porcentaje * 100}%</li>}
            {/* <li style={{ color: 'red' }}>
              {Object.keys(row)
                .filter((p) => !['porcentaje'].includes(p))
                .join(' - ')}
            </li> */}
          </ul>
        );
      }
      return JSON.stringify(row, null, 2);
    };
    return (
      <tr>
        <td>{formatDate(fecha)}</td>
        <td>{operacion()}</td>
        <td>{resto()}</td>
      </tr>
    );
  };
  const [consignas = [], loadingC, errorC] = useConsignas(
    'idDistribuidor',
    distribuidor.idDistribuidor
  );
  const [facturaciones = [], loadingF, errorF] = useFacturaciones(
    'idDistribuidor',
    distribuidor.idDistribuidor
  );
  if (errorC) return <ErrorAlert error={errorC}>Cargando Consigna</ErrorAlert>;

  if (loadingC) return <Loading>Cargando Consigna</Loading>;

  if (errorF)
    return <ErrorAlert error={errorF}>Cargando facturación</ErrorAlert>;
  if (loadingF) return <Loading>Cargando facturación</Loading>;
  return (
    <>
      <h3>Detalle de operaciones</h3>
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Operación</th>
            <th>Resto</th>
          </tr>
        </thead>
        <tbody>
          {[...consignas, ...facturaciones].sort(byFecha).map((r) => (
            <RowDetalle {...r} />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default function ShowDistribuidor() {
  const { idDistribuidor } = useParams<{ idDistribuidor: ID }>();
  const [distribuidor, loading, error] = useDistribuidor(idDistribuidor);
  if (loading) return <Loading>Cargando distribuidor</Loading>;
  if (error)
    return <ErrorAlert error={error}>Cargando distribuidor</ErrorAlert>;
  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : '??'}`}
      heading={`Distribuidor`}
    >
      {distribuidor ? (
        <>
          <LabeledText label="Nombre">{distribuidor.nombre}</LabeledText>
          <LabeledText label="eMail">{distribuidor.email}</LabeledText>
          <LabeledText label="Localidad">{distribuidor.localidad}</LabeledText>
          <LabeledText label="Dirección" pre>
            {distribuidor.direccion}
          </LabeledText>
          <LabeledText label="Contacto">{distribuidor.contacto}</LabeledText>
          <LabeledText label="Teléfono">{distribuidor.telefono}</LabeledText>
          <LabeledText label="NIF">{distribuidor.nif}</LabeledText>
          <ShowDetalle distribuidor={distribuidor} />
        </>
      ) : (
        <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
      )}
    </Page>
  );
}
