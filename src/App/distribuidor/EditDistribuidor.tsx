// Library imports
import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Alert, Form } from 'reactstrap';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// My own library imports
import { TextField, SubmitButton } from 'Components/Form';
import {
  ButtonIconAdd,
  ButtonIconDelete,
  ButtonSet,
} from '@bit/satyam.components.icons-and-buttons';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import { useModals } from 'Providers/Modals';

import {
  useDistribuidor,
  createDistribuidor,
  updateDistribuidor,
  deleteDistribuidor,
  CLAVE_DUPLICADA,
  FALTA_NOMBRE,
  DbError,
} from './common';

// Types

const distribuidorSchema = yup
  .object({
    nombre: yup.string().defined().trim().default(''),
    localidad: yup.string().trim().default(''),
    contacto: yup.string().trim().default(''),
    telefono: yup
      .string()
      .trim()
      .matches(/[\d\s\-()]+/, { excludeEmptyString: true })
      .default(''),
    email: yup.string().trim().email().default(''),
    direccion: yup.string().trim().default(''),
    nif: yup.string().trim().default(''),
  })
  .defined();

type DistribuidorFormType = yup.Asserts<typeof distribuidorSchema>;

const EditDistribuidor: React.FC = () => {
  const { idDistribuidor } = useParams<{ idDistribuidor: ID }>();
  const [distribuidor, loading, error] = useDistribuidor(idDistribuidor);
  const history = useHistory();
  const { openLoading, closeLoading, confirmDelete } = useModals();

  const methods = useForm<DistribuidorFormType>({
    defaultValues: distribuidorSchema.getDefault(),
    resolver: yupResolver(distribuidorSchema),
  });

  useEffect(() => {
    if (distribuidor) methods.reset(distribuidor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distribuidor]);

  if (error)
    return <ErrorAlert error={error}>Cargando distribuidor</ErrorAlert>;
  if (loading) {
    return <Loading>Cargando distribuidor</Loading>;
  }

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    confirmDelete(
      `al distribuidor ${distribuidor && distribuidor.nombre}`,
      async () => {
        await deleteDistribuidor(idDistribuidor);
        history.replace('/distribuidores');
      }
    );
  };

  const onSubmit: SubmitHandler<DistribuidorFormType> = async (
    values
  ): Promise<void> => {
    if (idDistribuidor && distribuidor) {
      openLoading('Actualizando Distribuidor');
      try {
        await updateDistribuidor(idDistribuidor, values, distribuidor);
      } catch (err) {
        if (err instanceof DbError) {
          methods.setError(err.field, {
            type: err.message,
            message: `Este campo ha sido cambiado por otro usuario a ${err.value}`,
          });
        } else throw err;
      }
    } else {
      openLoading('Creando distribuidor');
      try {
        const idDistribuidor = await createDistribuidor(values);
        history.replace(`/distribuidor/edit/${idDistribuidor}`);
      } catch (err) {
        if (err instanceof DbError) {
          switch (err.message) {
            case CLAVE_DUPLICADA:
              methods.setError('nombre', {
                type: 'duplicado',
                message: 'Ese nombre, o uno muy parecido, ya existe',
              });
              break;
            case FALTA_NOMBRE:
              methods.setError('nombre', {
                type: 'missing',
                message: 'Falta indicar el nombre',
              });
              break;
            default:
              throw err;
          }
        } else throw err;
      }
    }
    closeLoading();
  };

  if (idDistribuidor && !distribuidor) {
    return (
      <Alert color="warning">
        El distribuidor [{idDistribuidor}] no existe o ha sido borrado
      </Alert>
    );
  }
  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : 'nuevo'}`}
      heading={`${idDistribuidor ? 'Edit' : 'Add'} Distribuidor`}
    >
      {idDistribuidor && !distribuidor ? (
        <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
      ) : (
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <TextField name="nombre" label="Nombre" methods={methods} />
          <TextField name="email" label="eMail" methods={methods} />
          <TextField name="localidad" label="Localidad" methods={methods} />
          <TextField name="contacto" label="Contacto" methods={methods} />
          <TextField name="telefono" label="Teléfono" methods={methods} />
          <TextField
            name="direccion"
            label="Dirección"
            rows={5}
            methods={methods}
          />
          <TextField name="nif" label="NIF" methods={methods} />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd} methods={methods}>
              {idDistribuidor ? 'Modificar' : 'Agregar'}
            </SubmitButton>
            <ButtonIconDelete
              disabled={!idDistribuidor}
              onClick={onDeleteClick}
            >
              Borrar
            </ButtonIconDelete>
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
};

export default EditDistribuidor;
