import React from 'react';
import { Alert } from 'reactstrap';
import { useParams } from 'react-router-dom';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';

import { useDistribuidor } from './common';

export default function ShowDistribuidor() {
  const { idDistribuidor } = useParams<{ idDistribuidor: ID }>();
  const [distribuidor, loading, error] = useDistribuidor(idDistribuidor);

  if (loading) return <Loading>Cargando distribuidor</Loading>;

  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : '??'}`}
      heading={`Distribuidor`}
      error={error?.message}
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
        </>
      ) : (
        <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
      )}
    </Page>
  );
}
