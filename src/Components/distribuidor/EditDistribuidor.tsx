import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Alert, Form } from 'reactstrap';
import * as yup from 'yup';
import type { Schema } from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';

import { TextField, SubmitButton } from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useModals } from 'Providers/Modals';

import { useDistribuidor } from 'Store/distribuidores/hooks';
import {
  createDistribuidor,
  updateDistribuidor,
  deleteDistribuidor,
} from 'Store/distribuidores/actions';
import { useDispatch } from 'react-redux';

type ShortDistribuidor = Omit<DistribuidorType, 'idDistribuidor'>;

const distribuidorSchema = yup.object().shape<ShortDistribuidor>({
  nombre: yup.string().required().trim().default(''),
  localidad: yup.string().trim().default(''),
  contacto: yup.string().trim().default(''),
  telefono: yup
    .string()
    .trim()
    .matches(/[\d\s\-()]+/, { excludeEmptyString: true })
    .default(''),
  email: yup.string().trim().email().default(''),
  direccion: yup.string().trim().default(''),
  entregados: yup.number().default(0),
  existencias: yup.number().default(0),
  vendidos: yup.number().default(0),
});

const EditDistribuidor2: React.FC<{
  idDistribuidor: ID;
  // TODO distribuidor does have a value!!
  distribuidor?: ShortDistribuidor;
}> = ({ idDistribuidor, distribuidor }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { openLoading, closeLoading, confirmDelete } = useModals();

  const methods = useForm<ShortDistribuidor>({
    defaultValues: distribuidor,
    resolver: yupResolver(distribuidorSchema),
  });
  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    confirmDelete(
      `al distribuidor ${distribuidor && distribuidor.nombre}`,
      async () => {
        console.log(
          'delete',
          await dispatch(deleteDistribuidor(idDistribuidor))
        );
        history.replace('/distribuidores');
      }
    );
  };
  const onSubmit: SubmitHandler<ShortDistribuidor> = async (
    values,
    formMethods
  ): Promise<void> => {
    console.log('onSubmit id: ', idDistribuidor);
    if (idDistribuidor) {
      openLoading('Actualizando Distribuidor');
      console.log(
        'update',
        await dispatch(updateDistribuidor({ ...values, idDistribuidor }))
      );
      // .catch((err) => {
      //   if (
      //     err.message ===
      //     'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
      //   ) {
      //     formMethods.setError('nombre', {
      //       type: 'duplicate',
      //       message: 'Ese distribuidor ya existe',
      //     });
      //   } else throw err;
      // })
      // .finally(closeLoading);
      closeLoading();
    } else {
      openLoading('Creando distribuidor');
      console.log(
        'create',
        await dispatch(createDistribuidor({ ...values, idDistribuidor }))
      );
      history.replace(`/distribuidor/edit/${idDistribuidor}`);
      // .catch((err) => {
      //   if (
      //     err.message ===
      //     'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
      //   ) {
      //     formMethods.setError('nombre', {
      //       type: 'duplicate',
      //       message: 'Ese distribuidor ya existe',
      //     });
      //   } else throw err;
      // })
      // .finally(closeLoading);
      closeLoading();
    }
  };
  return (
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
      <ButtonSet>
        <SubmitButton component={ButtonIconAdd} methods={methods}>
          {idDistribuidor ? 'Modificar' : 'Agregar'}
        </SubmitButton>
        <ButtonIconDelete disabled={!idDistribuidor} onClick={onDeleteClick}>
          Borrar
        </ButtonIconDelete>
      </ButtonSet>
    </Form>
  );
};

export default function EditDistribuidor() {
  const { idDistribuidor } = useParams<{ idDistribuidor: ID }>();
  const { loading, error, distribuidor } = useDistribuidor(idDistribuidor);

  if (loading) return <Loading>Cargando distribuidor</Loading>;

  // delete distribuidor?.idDistribuidor
  console.log(idDistribuidor, distribuidor);
  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : 'nuevo'}`}
      heading={`${idDistribuidor ? 'Edit' : 'Add'} Distribuidor`}
      error={error?.message}
    >
      {idDistribuidor && !distribuidor ? (
        <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
      ) : (
        <EditDistribuidor2
          idDistribuidor={idDistribuidor}
          distribuidor={
            idDistribuidor && distribuidor
              ? (distribuidor as Omit<DistribuidorType, 'idDistribuidor'>)
              : distribuidorSchema.default()
          }
        />
      )}
    </Page>
  );
}
