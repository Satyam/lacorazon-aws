import React from 'react';
import { useParams } from 'react-router-dom';

import { LabeledText } from '@satyam/react-form';

import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import { Alert } from 'reactstrap';
import { useIntl } from '@satyam/react-form';

import { useGasto } from './common';
import { LabeledCuentas } from 'App/cuentas/gadgets';
import { LabeledIVA, calculoIVA } from 'App/iva/gadgets';
export default function ShowGasto() {
  const { idGasto } = useParams<{ idGasto: ID }>();
  const [gasto, loading, error] = useGasto(idGasto);
  const { formatDate, formatCurrency } = useIntl();
  if (error) return <ErrorAlert error={error}>Cargando gasto</ErrorAlert>;
  if (loading) return <Loading>Cargando gasto</Loading>;
  const { importeSinIva, importeIva } = calculoIVA(gasto?.importe, gasto?.iva);

  return (
    <Page title={`Gasto - ${gasto ? gasto.fecha : '??'}`} heading={`Gasto`}>
      {gasto ? (
        <>
          <LabeledText label="Fecha">
            {formatDate(new Date(gasto.fecha))}
          </LabeledText>

          <LabeledText label="Concepto">{gasto.concepto}</LabeledText>
          <LabeledText label="Importe">
            {formatCurrency(gasto.importe)}
          </LabeledText>
          <LabeledCuentas label="Cuenta" idCuenta={gasto.cuenta} />
          <LabeledIVA label="IVA%" iva={gasto.iva} />
          <LabeledText label="IVA">{formatCurrency(importeIva)}</LabeledText>
          <LabeledText label="Importe sin IVA">
            {formatCurrency(importeSinIva)}
          </LabeledText>
        </>
      ) : (
        <Alert color="danger">La gasto no existe o fue borrada</Alert>
      )}
    </Page>
  );
}
