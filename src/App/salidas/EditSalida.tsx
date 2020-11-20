import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Form } from 'reactstrap';

import {
  TextField,
  DateField,
  SubmitButton,
  DropdownField,
} from 'Components/Form';
import { DropdownVendedores } from 'App/vendedores/gadgets';
import { DropdownCuentas } from 'App/cuentas/gadgets';

import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import { Loading } from 'Components/Modals';
import Page from 'Components/Page';
import { useIntl } from 'Providers/Intl';
import { useModals } from 'Providers/Modals';

import {
  useSalida,
  updateSalida,
  createSalida,
  deleteSalida,
  GASTO,
  REINTEGRO,
  PAGO_IVA,
  COMISION,
} from './common';

type ShortSalida = Omit<SalidaType, 'idSalida'>;

const salidaSchema = yup.object().shape<ShortSalida>({
  // @ts-ignore
  fecha: yup
    .date()
    .required()
    .default(() => new Date()),
  concepto: yup.string().trim().required().default(''),
  // @ts-ignore
  categoria: yup
    .string()
    .oneOf([GASTO, REINTEGRO, PAGO_IVA, COMISION])
    .default(GASTO),
  // @ts-ignore
  idVendedor: yup.string().default(null),
  // @ts-ignore
  importe: yup.number().default(0),
  cuenta: yup.string().default(null),
  iva: yup.number().positive().max(1).default(null),
});

export default function EditSalida() {
  const history = useHistory();
  const { idSalida } = useParams<{ idSalida: ID }>();
  const isNew: boolean = !idSalida;
  const [salida, loading, error] = useSalida(idSalida);
  const methods = useForm<ShortSalida>({
    defaultValues: salidaSchema.default(),
    resolver: yupResolver(salidaSchema),
  });

  useEffect(() => {
    if (salida) methods.reset(salida);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salida]);

  const { openLoading, closeLoading, confirmDelete } = useModals();
  const { formatDate } = useIntl();

  if (loading) return <Loading>Cargando salida</Loading>;

  const onSubmit: SubmitHandler<ShortSalida> = async (values) => {
    if (idSalida && salida) {
      openLoading('Actualizando Salida');
      await updateSalida(idSalida, values, salida);
    } else {
      openLoading('Creando Salida');
      const idSalida = await createSalida(values);
      history.replace(`/salida/edit/${idSalida}`);
    }
    closeLoading();
  };

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    confirmDelete(
      `la salida del ${formatDate(salida && salida.fecha)}`,
      async () => {
        await deleteSalida(idSalida);
        history.replace('/salidas');
      }
    );
  };

  return (
    <Page
      title={`Salida - ${salida ? salida.fecha : 'nuevo'}`}
      heading={`${idSalida ? 'Edit' : 'Add'} Salida`}
      error={error?.name === 'DuplicateError' ? undefined : error?.message}
    >
      {idSalida && !salida ? (
        <Alert color="danger">La salida no existe o fue borrada</Alert>
      ) : (
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <DateField name="fecha" label="Fecha" methods={methods} />
          <TextField name="concepto" label="Concepto" methods={methods} />
          <DropdownField
            name="categoria"
            label="Categoría"
            noOption={isNew}
            optValue="value"
            optLabel="label"
            options={[
              { label: 'Gasto', value: GASTO },
              { label: 'Reintegro', value: REINTEGRO },
              { label: 'Pago de IVA', value: PAGO_IVA },
              { label: 'Pago Comisión', value: COMISION },
            ]}
            methods={methods}
          />
          {salida?.categoria === COMISION && (
            <DropdownVendedores
              name="idVendedor"
              label="Vendedor"
              noOption={isNew}
              methods={methods}
            />
          )}

          <TextField name="importe" label="Importe" methods={methods} />

          <DropdownCuentas
            name="cuenta"
            label="Cuenta"
            noOption={!idSalida}
            methods={methods}
          />
          <TextField name="iva" label="IVA%" methods={methods} />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd} methods={methods}>
              {isNew ? 'Agregar' : 'Modificar'}
            </SubmitButton>
            {idSalida && (
              <ButtonIconDelete disabled={!idSalida} onClick={onDeleteClick}>
                Borrar
              </ButtonIconDelete>
            )}
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
}
