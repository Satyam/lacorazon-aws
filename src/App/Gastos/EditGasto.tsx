import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Form } from 'reactstrap';

import {
  TextField,
  CurrencyField,
  DateField,
  SubmitButton,
} from 'Components/Form';
import { DropdownCuentas } from 'App/cuentas/gadgets';
import { DropdownIVA } from 'App/iva/gadgets';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import { Loading } from 'Components/Modals';
import Page from 'Components/Page';
import { useIntl } from 'Providers/Intl';
import { useModals } from 'Providers/Modals';

import { useGasto, updateGasto, createGasto, deleteGasto } from './common';

type ShortGasto = Omit<GastoType, 'idGasto'>;

const gastoSchema = yup.object().shape<ShortGasto>({
  // @ts-ignore
  fecha: yup
    .date()
    .required()
    .default(() => new Date()),
  concepto: yup.string().trim().required().default(''),
  // @ts-ignore
  idVendedor: yup.string().nullable().default(null),
  // @ts-ignore
  importe: yup.number().nullable().default(0),
  // @ts-ignore
  cuenta: yup.string().nullable().default(null),
  // @ts-ignore
  iva: yup.number().nullable().min(0).default(0),
});

export default function EditGasto() {
  const history = useHistory();
  const { idGasto } = useParams<{ idGasto: ID }>();
  const isNew: boolean = !idGasto;
  const [gasto, loading, error] = useGasto(idGasto);
  const methods = useForm<ShortGasto>({
    defaultValues: gastoSchema.default(),
    // @ts-ignore
    resolver: yupResolver(gastoSchema),
  });

  useEffect(() => {
    if (gasto) methods.reset(gasto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gasto]);

  const { openLoading, closeLoading, confirmDelete } = useModals();
  const { formatDate } = useIntl();

  if (loading) return <Loading>Cargando gasto</Loading>;

  const onSubmit: SubmitHandler<ShortGasto> = async (values) => {
    if (idGasto && gasto) {
      openLoading('Actualizando Gasto');
      await updateGasto(idGasto, values, gasto);
    } else {
      openLoading('Creando Gasto');
      const idGasto = await createGasto(values);
      history.replace(`/gasto/edit/${idGasto}`);
    }
    closeLoading();
  };

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    confirmDelete(
      `la gasto del ${formatDate(gasto && gasto.fecha)}`,
      async () => {
        await deleteGasto(idGasto);
        history.replace('/gastos');
      }
    );
  };
  return (
    <Page
      title={`Gasto - ${gasto ? gasto.fecha : 'nuevo'}`}
      heading={`${idGasto ? 'Edit' : 'Add'} Gasto`}
      error={error?.name === 'DuplicateError' ? undefined : error?.message}
    >
      {idGasto && !gasto ? (
        <Alert color="danger">La gasto no existe o fue borrada</Alert>
      ) : (
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <DateField name="fecha" label="Fecha" methods={methods} />
          <TextField name="concepto" label="Concepto" methods={methods} />

          <CurrencyField name="importe" label="Importe" methods={methods} />

          <DropdownCuentas
            name="cuenta"
            label="Cuenta"
            noOption={!idGasto}
            methods={methods}
          />

          <DropdownIVA name="iva" label="IVA%" methods={methods} />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd} methods={methods}>
              {isNew ? 'Agregar' : 'Modificar'}
            </SubmitButton>
            {idGasto && (
              <ButtonIconDelete disabled={!idGasto} onClick={onDeleteClick}>
                Borrar
              </ButtonIconDelete>
            )}
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
}
