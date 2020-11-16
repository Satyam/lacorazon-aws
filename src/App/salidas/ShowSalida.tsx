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
          <LabeledText
            label="Fecha"
            value={formatDate(new Date(salida.fecha))}
          />
          <LabeledText label="Categoría">
            <ShowCategoria {...salida} />
          </LabeledText>

          <LabeledText label="Concepto" value={salida.concepto} />
          <LabeledText label="Importe" value={formatCurrency(salida.importe)} />
          <LabeledCuentas label="Cuenta" idCuenta={salida.cuenta} />
          {salida.iva && <LabeledText label="IVA" value={`${salida.iva}%`} />}
        </>
      ) : (
        <Alert color="danger">La salida no existe o fue borrada</Alert>
      )}
    </Page>
  );
}
