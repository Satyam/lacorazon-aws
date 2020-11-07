// Library imports
import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Alert, Form } from 'reactstrap';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import slugify from 'slugify';

// My own library imports
import { TextField, SubmitButton } from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useModals } from 'Providers/Modals';

import { useDistribuidor, distrRef, updateDistribuidor } from './common';

// Types
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
  nif: yup.string().trim().default(''),
});

const EditDistribuidor: React.FC = () => {
  const { idDistribuidor } = useParams<{ idDistribuidor: ID }>();
  const [distribuidor, loading, error] = useDistribuidor(idDistribuidor);
  const history = useHistory();
  const { openLoading, closeLoading, confirmDelete } = useModals();

  const methods = useForm<ShortDistribuidor>({
    defaultValues: distribuidorSchema.default(),
    resolver: yupResolver(distribuidorSchema),
  });

  useEffect(() => {
    if (distribuidor) methods.reset(distribuidor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distribuidor]);

  if (loading) {
    return <Loading>Cargando distribuidor</Loading>;
  }

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    confirmDelete(
      `al distribuidor ${distribuidor && distribuidor.nombre}`,
      async () => {
        await distrRef(idDistribuidor).remove();
        history.replace('/distribuidores');
      }
    );
  };

  const onSubmit: SubmitHandler<ShortDistribuidor> = async (
    values,
    formMethods
  ): Promise<void> => {
    if (idDistribuidor && distribuidor) {
      openLoading('Actualizando Distribuidor');
      await updateDistribuidor<ShortDistribuidor>(
        idDistribuidor,
        values,
        distribuidor
      );

      if (methods.formState.isDirty) {
        await distrRef(idDistribuidor).transaction((dbValues) => {
          if (
            Object.keys(methods.formState.dirtyFields).some(
              (name) =>
                dbValues[name] !==
                (distribuidor as ShortDistribuidor)[
                  name as keyof ShortDistribuidor
                ]
            )
          )
            return;

          return Object.keys(methods.formState.dirtyFields).reduce<
            Partial<DistribuidorType>
          >(
            (newValues, name) => ({
              ...newValues,
              [name]: values[name as keyof ShortDistribuidor],
            }),
            distribuidor as ShortDistribuidor
          );
        });
      }
    } else {
      openLoading('Creando distribuidor');
      var slug = slugify(values.nombre, { lower: true });
      const duplicate = await distrRef(slug).once('value');
      if (duplicate.exists()) {
        methods.setError('nombre', {
          type: 'duplicado',
          message: 'Ese nombre, o uno muy parecido, ya existe',
        });
      } else {
        await distrRef(slug).set({
          ...values,
          idDistribuidor: slug,
        });
        history.replace(`/distribuidor/edit/${slug}`);
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
      error={error?.name === 'DuplicateError' ? undefined : error?.message}
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
