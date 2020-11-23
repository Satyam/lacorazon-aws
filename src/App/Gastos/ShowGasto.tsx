import React from 'react';
import { useParams } from 'react-router-dom';

import { LabeledText } from 'Components/Form';

import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { Alert } from 'reactstrap';
import { useIntl } from 'Providers/Intl';

import { useGasto } from './common';
import { LabeledCuentas } from 'App/cuentas/gadgets';
import { LabeledIVA } from 'App/iva/gadgets';
export default function ShowGasto() {
  const { idGasto } = useParams<{ idGasto: ID }>();
  const [gasto, loading, error] = useGasto(idGasto);
  const { formatDate, formatCurrency } = useIntl();

  if (loading) return <Loading>Cargando gasto</Loading>;

  return (
    <Page
      title={`Gasto - ${gasto ? gasto.fecha : '??'}`}
      heading={`Gasto`}
      error={error}
    >
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
          {gasto.iva && <LabeledIVA label="IVA" iva={gasto.iva} />}
        </>
      ) : (
        <Alert color="danger">La gasto no existe o fue borrada</Alert>
      )}
    </Page>
  );
}
