// Library imports
import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Alert, Form } from 'reactstrap';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { unwrapResult, SerializedError } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

// My own library imports
import { TextField, SubmitButton } from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useModals } from 'Providers/Modals';

// App-related imports
import { useDistribuidor } from 'Store/distribuidores/hooks';
import {
  createDistribuidor,
  updateDistribuidor,
  deleteDistribuidor,
} from 'Store/distribuidores/actions';

// Types
import type { AppDispatch } from 'Store';
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
  distribuidor?: ShortDistribuidor;
}> = ({ idDistribuidor, distribuidor }) => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const { openLoading, closeLoading, confirmDelete } = useModals();
  console.log('EditDistribuidor2', distribuidor);
  const methods = useForm<ShortDistribuidor>({
    defaultValues: distribuidorSchema.default(),
    resolver: yupResolver(distribuidorSchema),
  });

  useEffect(() => {
    if (distribuidor) methods.reset(distribuidor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distribuidor]);
  console.log('method values', methods.getValues());
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
    console.log(
      'onSubmit: ',
      methods.formState.isDirty,
      idDistribuidor,
      values,
      methods.formState.dirtyFields
    );
    if (idDistribuidor) {
      openLoading('Actualizando Distribuidor');
      if (methods.formState.isDirty) {
        const changes: Partial<DistribuidorType> = Object.keys(
          methods.formState.dirtyFields
        ).reduce<Partial<DistribuidorType>>(
          (cs, k) => ({
            ...cs,
            // @ts-ignore
            [k]: values[k],
          }),
          {}
        );
        console.log(
          'update',
          await dispatch(
            updateDistribuidor({ idDistribuidor, ...changes })
          ).catch((err: SerializedError) => {
            console.error('update error', err);
            return { idDistribuidor: null };
          })
        );

        closeLoading();
      }
    } else {
      openLoading('Creando distribuidor');
      const distr = await dispatch(
        createDistribuidor({ ...values, idDistribuidor })
      )
        .then(unwrapResult)
        .catch((err: SerializedError) => {
          console.error(' create error', err);
          return { idDistribuidor: null };
        });
      history.replace(`/distribuidor/edit/${distr.idDistribuidor}`);
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
  const { loading, error, distribuidor, status } = useDistribuidor(
    idDistribuidor
  );

  if (loading) return <Loading>Cargando distribuidor</Loading>;
  console.log({ loading, error, status, idDistribuidor, distribuidor });
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
          distribuidor={distribuidor}
        />
      )}
    </Page>
  );
}
