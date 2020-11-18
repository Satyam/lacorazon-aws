import React from 'react';
import { useParams } from 'react-router-dom';

import { LabeledText } from 'Components/Form';

import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { Alert } from 'reactstrap';
import { useIntl } from 'Providers/Intl';

import { useSalida } from './common';
import { ShowCategoria } from './gadgets';
import { LabeledCuentas } from 'App/cuentas/gadgets';

export default function ShowSalida() {
  const { idSalida } = useParams<{ idSalida: ID }>();
  const [salida, loading, error] = useSalida(idSalida);
  const { formatDate, formatCurrency } = useIntl();

  if (loading) return <Loading>Cargando salida</Loading>;

  return (
    <Page
      title={`Salida - ${salida ? salida.fecha : '??'}`}
      heading={`Salida`}
      error={error}
    >
      {salida ? (
        <>
          <LabeledText label="Fecha">
            {formatDate(new Date(salida.fecha))}
          </LabeledText>

          <LabeledText label="Categoría">
            <ShowCategoria {...salida} />
          </LabeledText>

          <LabeledText label="Concepto">{salida.concepto}</LabeledText>
          <LabeledText label="Importe">
            {formatCurrency(salida.importe)}
          </LabeledText>
          <LabeledCuentas label="Cuenta" idCuenta={salida.cuenta} />
          {salida.iva && (
            <LabeledText label="IVA">{`${salida.iva}%`}</LabeledText>
          )}
        </>
      ) : (
        <Alert color="danger">La salida no existe o fue borrada</Alert>
      )}
    </Page>
  );
}
