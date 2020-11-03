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
  SubmitButton,
} from 'Components/Form';
import DropdownVendedor from 'Components/vendedores/Dropdown';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import { Loading } from 'Components/Modals';
import Page from 'Components/Page';
import { useIntl } from 'Providers/Intl';
import { useModals } from 'Providers/Modals';

import { useVenta } from 'Firebase';

type ShortVenta = Omit<VentaType, 'idVenta'>;
// @ts-ignore
const ventaSchema = yup.object().shape<ShortVenta>({
  // @ts-ignore
  fecha: yup
    .date()
    .required()
    .default(() => new Date().toISOString()),
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
  const { id } = useParams<{ id: ID }>();
  const [venta, loading, error] = useVenta(id);

  const methods = useForm<ShortVenta>({
    defaultValues: ventaSchema.default(),
    resolver: yupResolver(ventaSchema),
  });

  useEffect(() => {
    if (venta) methods.reset(venta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venta]);

  // const optionVendedoresStatus = useOptionsVendedores();
  // const createVenta = useCreateVenta();
  // const updateVenta = useUpdateVenta();
  // const deleteVenta = useDeleteVenta();
  const { openLoading, closeLoading, confirmDelete } = useModals();
  const { formatDate } = useIntl();

  if (loading) return <Loading>Cargando venta</Loading>;

  const onSubmit: SubmitHandler<ShortVenta> = async (values) => {
    if (id) {
      openLoading('Actualizando Venta');
      // await updateVenta(id, values).finally(closeLoading);
    } else {
      openLoading('Creando Venta');
      // await createVenta(values)
      //   .then((id) => {
      //     history.replace(`/venta/edit/${id}`);
      //   })
    }
    closeLoading();
  };

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    // confirmDelete(`la venta del ${formatDate(venta && venta.fecha)}`, () =>
    //   deleteVenta(id!).then(() => history.replace('/ventas'))
    // );
  };
  debugger;
  return (
    <Page
      title={`Venta - ${venta ? venta.fecha : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Venta`}
      error={error?.name === 'DuplicateError' ? undefined : error?.message}
    >
      {id && !venta ? (
        <Alert color="danger">La venta no existe o fue borrada</Alert>
      ) : (
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <DateField name="fecha" label="Fecha" methods={methods} />
          <TextField name="concepto" label="Concepto" methods={methods} />
          <DropdownVendedor
            name="idVendedor"
            label="Vendedor"
            noOption={!id}
            methods={methods}
          />

          <TextField name="cantidad" label="Cantidad" methods={methods} />
          <CheckboxField name="iva" label="IVA" methods={methods} />
          <TextField
            name="precioUnitario"
            label="Precio Unitario"
            methods={methods}
          />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd} methods={methods}>
              {id ? 'Modificar' : 'Agregar'}
            </SubmitButton>
            {id && (
              <ButtonIconDelete disabled={!id} onClick={onDeleteClick}>
                Borrar
              </ButtonIconDelete>
            )}
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
}
