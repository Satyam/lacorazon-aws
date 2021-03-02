import React from 'react';
import { useParams } from 'react-router-dom';

import { LabeledText } from 'Components/Form';

import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import { Alert } from 'reactstrap';
import { useIntl } from '@bit/satyam.components.intl-provider';

import { useFacturacion } from './common';
import { LabeledCuentas } from 'App/cuentas/gadgets';
import { LabeledIVA, calculoIVA } from 'App/iva/gadgets';
import { ShowDistribuidor } from 'App/distribuidor/gadgets';
import { LabeledVendedores } from 'App/vendedores/gadgets';
import configs from 'App/config';
const { IVALibros } = configs;

export default function ShowFactura() {
  const { idFactura } = useParams<{ idFactura: ID }>();
  const [factura, loading, error] = useFacturacion(idFactura);
  const { formatDate, formatCurrency } = useIntl();
  if (error) return <ErrorAlert error={error}>Cargando factura</ErrorAlert>;
  if (loading) return <Loading>Cargando factura</Loading>;
  if (typeof factura === 'undefined') return null;
  const {
    idDistribuidor,
    fecha,
    concepto,
    idVendedor,
    porcentaje,
    facturado,
    iva,
    nroFactura,
    cobrado,
    cuenta,
    cantidad,
  } = factura;
  const { importeSinIva, importeIva } = calculoIVA(facturado, iva);
  return (
    <Page
      title={`Factura - ${nroFactura || formatDate(fecha)}`}
      heading={`Factura`}
    >
      {factura ? (
        <>
          <LabeledText label="Fecha">{formatDate(new Date(fecha))}</LabeledText>
          <LabeledText label="Distribuidor">
            <ShowDistribuidor idDistribuidor={idDistribuidor} />
          </LabeledText>
          <LabeledText label="Concepto">{concepto}</LabeledText>
          {nroFactura && (
            <LabeledText label="Número Factura">{nroFactura}</LabeledText>
          )}
          {cantidad && <LabeledText label="Cantidad">{cantidad}</LabeledText>}
          {porcentaje &&
            (porcentaje > 1 ? (
              <LabeledText label="Precio por unidad">
                {formatCurrency(porcentaje)}
              </LabeledText>
            ) : (
              <LabeledText label="Comisión distr.">
                {porcentaje * 100}%
              </LabeledText>
            ))}
          {facturado && (
            <LabeledText label="Facturado">
              {formatCurrency(facturado)}
            </LabeledText>
          )}
          {cuenta && <LabeledCuentas label="Cuenta" idCuenta={cuenta} />}
          {(iva || facturado) && (
            <LabeledIVA label="IVA%" iva={iva || IVALibros} />
          )}
          {importeIva && (
            <LabeledText label="IVA">{formatCurrency(importeIva)}</LabeledText>
          )}
          {importeSinIva && (
            <LabeledText label="Importe sin IVA">
              {formatCurrency(importeSinIva)}
            </LabeledText>
          )}
          {idVendedor && (
            <LabeledVendedores label="Vendedor" idVendedor={idVendedor} />
          )}
          {cobrado && (
            <LabeledText label="Cobrado">{formatCurrency(cobrado)}</LabeledText>
          )}
        </>
      ) : (
        <Alert color="danger">La factura no existe o fue borrada</Alert>
      )}
    </Page>
  );
}
