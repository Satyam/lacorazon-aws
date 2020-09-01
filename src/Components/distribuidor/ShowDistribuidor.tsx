import React, { useEffect } from 'react';
import { Alert } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import {
  selDistribuidores,
  selDistribuidoresHash,
} from 'Store/distribuidores/selectors';
import { listDistribuidores } from 'Store/distribuidores/actions';
import { IDLE, LOADING } from 'Store/constants';

export default function ShowDistribuidor() {
  const dispatch = useDispatch();
  const { idDistribuidor } = useParams<{ idDistribuidor: ID }>();
  const { status, error } = useSelector(selDistribuidores);

  useEffect(() => {
    if (status === IDLE) dispatch(listDistribuidores());
  }, [dispatch, status]);

  const distribuidor = useSelector(selDistribuidoresHash)[idDistribuidor];

  if (status === LOADING) return <Loading>Cargando distribuidor</Loading>;

  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : '??'}`}
      heading={`Distribuidor`}
      error={error?.message}
    >
      {distribuidor ? (
        <>
          <LabeledText label="Nombre" value={distribuidor.nombre} />
          <LabeledText label="eMail" value={distribuidor.email} />
          <LabeledText label="Localidad" value={distribuidor.localidad} />
          <LabeledText label="Dirección" value={distribuidor.direccion} pre />
          <LabeledText label="Contacto" value={distribuidor.contacto} />
          <LabeledText label="Teléfono" value={distribuidor.telefono} />
          <LabeledText label="Entregados" value={distribuidor.entregados} />
          <LabeledText label="Existencias" value={distribuidor.existencias} />
        </>
      ) : (
        <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
      )}
    </Page>
  );
}
