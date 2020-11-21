import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Form } from 'reactstrap';

import {
  TextField,
  DateField,
  CheckboxField,
  CurrencyField,
  SubmitButton,
} from 'Components/Form';
import { DropdownVendedores } from 'App/vendedores/gadgets';
import { DropdownCuentas } from 'App/cuentas/gadgets';

import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import { Loading } from 'Components/Modals';
import Page from 'Components/Page';
import { useIntl } from 'Providers/Intl';
import { useModals } from 'Providers/Modals';

import { useVenta, updateVenta, createVenta, deleteVenta } from './common';

type ShortVenta = Omit<VentaType, 'idVenta'>;

const ventaSchema = yup.object().shape<ShortVenta>({
  // @ts-ignore
  fecha: yup
    .date()
    .required()
    .default(() => new Date()),
  concepto: yup.string().trim().required().default(''),
  // @ts-ignore
  cantidad: yup.number().integer().default(1),
  precioUnitario: yup.number().default(10),
  // @ts-ignore
  iva: yup.boolean().default(false),
  idVendedor: yup.string().default(null),
});

export default function EditVenta() {
  const history = useHistory();
  const { idVenta } = useParams<{ idVenta: ID }>();
  const [venta, loading, error] = useVenta(idVenta);

  const methods = useForm<ShortVenta>({
    defaultValues: ventaSchema.default(),
    resolver: yupResolver(ventaSchema),
  });

  useEffect(() => {
    if (venta) methods.reset(venta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venta]);

  const { openLoading, closeLoading, confirmDelete } = useModals();
  const { formatDate } = useIntl();

  if (loading) return <Loading>Cargando venta</Loading>;

  const onSubmit: SubmitHandler<ShortVenta> = async (values) => {
    if (idVenta && venta) {
      openLoading('Actualizando Venta');
      await updateVenta(idVenta, values, venta);
    } else {
      openLoading('Creando Venta');
      const idVenta = await createVenta(values);
      history.replace(`/venta/edit/${idVenta}`);
    }
    closeLoading();
  };

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    confirmDelete(
      `la venta del ${formatDate(venta && venta.fecha)}`,
      async () => {
        await deleteVenta(idVenta);
        history.replace('/ventas');
      }
    );
  };

  return (
    <Page
      title={`Venta - ${venta ? venta.fecha : 'nuevo'}`}
      heading={`${idVenta ? 'Edit' : 'Add'} Venta`}
      error={error?.name === 'DuplicateError' ? undefined : error?.message}
    >
      {idVenta && !venta ? (
        <Alert color="danger">La venta no existe o fue borrada</Alert>
      ) : (
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <DateField name="fecha" label="Fecha" methods={methods} />
          <TextField name="concepto" label="Concepto" methods={methods} />
          <DropdownVendedores
            name="idVendedor"
            label="Vendedor"
            noOption={!idVenta}
            methods={methods}
          />

          <TextField
            type="number"
            name="cantidad"
            label="Cantidad"
            methods={methods}
          />
          <CheckboxField name="iva" label="IVA" methods={methods} />
          <CurrencyField
            name="precioUnitario"
            label="Precio Unitario"
            methods={methods}
          />
          <DropdownCuentas
            name="cuenta"
            label="Cuenta"
            noOption={!idVenta}
            methods={methods}
          />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd} methods={methods}>
              {idVenta ? 'Modificar' : 'Agregar'}
            </SubmitButton>
            {idVenta && (
              <ButtonIconDelete disabled={!idVenta} onClick={onDeleteClick}>
                Borrar
              </ButtonIconDelete>
            )}
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
}
