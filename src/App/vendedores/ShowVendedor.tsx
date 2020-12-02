import React from 'react';
import { Alert } from 'reactstrap';
import { useParams } from 'react-router-dom';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';

import { useVendedor } from './common';

export default function ShowVendedor() {
  const { idVendedor } = useParams<{ idVendedor: ID }>();
  const [vendedor, loading, error] = useVendedor(idVendedor);

  if (loading) return <Loading>Cargando vendedor</Loading>;
  if (error) return <ErrorAlert error={error}>Cargando vendedor</ErrorAlert>;
  return (
    <Page
      title={`Vendedor - ${vendedor ? vendedor.nombre : '??'}`}
      heading={`Vendedor`}
    >
      {vendedor ? (
        <>
          <LabeledText label="Abreviatura">{idVendedor}</LabeledText>
          <LabeledText label="Nombre">{vendedor.nombre}</LabeledText>
          <LabeledText label="eMail">{vendedor.email}</LabeledText>
        </>
      ) : (
        <Alert color="danger">El vendedor no existe o fue borrado</Alert>
      )}
    </Page>
  );
}
