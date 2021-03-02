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
  useVendedor,
  createVendedor,
  updateVendedor,
  deleteVendedor,
  CLAVE_DUPLICADA,
  FALTA_NOMBRE,
  DbError,
} from './common';

const vendedorSchema = yup.object({
  idVendedor: yup.string().required().trim(),
  nombre: yup.string().required().trim().default(''),
  email: yup.string().trim().email().default(''),
});

type VendedorFormType = yup.Asserts<typeof vendedorSchema>;

const EditVendedor: React.FC = () => {
  const { idVendedor } = useParams<{ idVendedor: ID }>();
  const [vendedor, loading, error] = useVendedor(idVendedor);
  const history = useHistory();
  const { openLoading, closeLoading, confirmDelete } = useModals();

  const methods = useForm<VendedorFormType>({
    defaultValues: vendedorSchema.getDefault(),
    resolver: yupResolver(vendedorSchema),
  });

  useEffect(() => {
    if (vendedor) methods.reset(vendedor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendedor]);

  if (error) return <ErrorAlert error={error}>Cargando vendedor</ErrorAlert>;
  if (loading) {
    return <Loading>Cargando vendedor</Loading>;
  }
  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    confirmDelete(`al vendedor ${vendedor && vendedor.nombre}`, async () => {
      await deleteVendedor(idVendedor);
      history.replace('/vendedores');
    });
  };

  const onSubmit: SubmitHandler<VendedorFormType> = async (
    values
  ): Promise<void> => {
    if (idVendedor && vendedor) {
      openLoading('Actualizando Vendedor');
      try {
        await updateVendedor(idVendedor, values, vendedor);
      } catch (err) {
        if (err instanceof DbError) {
          methods.setError(err.field, {
            type: err.message,
            message: `Este campo ha sido cambiado por otro usuario a ${err.value}`,
          });
        } else throw err;
      }
    } else {
      openLoading('Creando vendedor');
      try {
        const idVendedor = await createVendedor(values);
        history.replace(`/vendedor/edit/${idVendedor}`);
      } catch (err) {
        if (err instanceof DbError) {
          switch (err.message) {
            case CLAVE_DUPLICADA:
              methods.setError('idVendedor', {
                type: 'duplicado',
                message: 'Esa abreviatura, o una muy parecida, ya existe',
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

  if (idVendedor && !vendedor) {
    return (
      <Alert color="warning">
        El vendedor [{idVendedor}] no existe o ha sido borrado
      </Alert>
    );
  }
  return (
    <Page
      title={`Vendedor - ${vendedor ? vendedor.nombre : 'nuevo'}`}
      heading={`${idVendedor ? 'Edit' : 'Add'} Vendedor`}
    >
      {idVendedor && !vendedor ? (
        <Alert color="danger">El vendedor no existe o fue borrado</Alert>
      ) : (
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <TextField name="idVendedor" label="Abreviatura" methods={methods} />
          <TextField name="nombre" label="Nombre" methods={methods} />
          <TextField name="email" label="eMail" methods={methods} />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd} methods={methods}>
              {idVendedor ? 'Modificar' : 'Agregar'}
            </SubmitButton>
            <ButtonIconDelete disabled={!idVendedor} onClick={onDeleteClick}>
              Borrar
            </ButtonIconDelete>
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
};

export default EditVendedor;
