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
  LabeledText,
} from 'Components/Form';
import { DropdownCuentas } from 'App/cuentas/gadgets';
import { DropdownIVA, calculoIVA } from 'App/iva/gadgets';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import Page from 'Components/Page';
import { useIntl } from 'Providers/Intl';
import { useModals } from 'Providers/Modals';

import { cuentas } from 'App/cuentas/gadgets';
import { useGasto, updateGasto, createGasto, deleteGasto } from './common';

const gastoSchema = yup.object({
  fecha: yup
    .date()
    .required()
    .default(() => new Date()),
  concepto: yup.string().trim().required().default(''),
  importe: yup.number().required().default(0),
  cuenta: yup.string().required().default(Object.keys(cuentas)[0]),
  iva: yup.number().min(0).default(0),
});

type GastoFormType = yup.Asserts<typeof gastoSchema>;

export default function EditGasto() {
  const history = useHistory();
  const { idGasto } = useParams<{ idGasto: ID }>();
  const isNew: boolean = !idGasto;
  const [gasto, loading, error] = useGasto(idGasto);
  const methods = useForm<GastoFormType>({
    defaultValues: gastoSchema.getDefault(),
    resolver: yupResolver(gastoSchema),
  });

  useEffect(() => {
    if (gasto) methods.reset(gasto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gasto]);

  const { openLoading, closeLoading, confirmDelete } = useModals();
  const { formatDate, formatCurrency } = useIntl();

  if (error) return <ErrorAlert error={error}>Cargando gasto</ErrorAlert>;
  if (loading) return <Loading>Cargando gasto</Loading>;

  const onSubmit: SubmitHandler<GastoFormType> = async (values) => {
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
  const { iva, importe } = methods.watch(['iva', 'importe'], {
    iva: gasto?.iva,
    importe: gasto?.importe,
  });
  const { importeSinIva, importeIva } = calculoIVA(importe, iva);

  return (
    <Page
      title={`Gasto - ${gasto ? gasto.fecha : 'nuevo'}`}
      heading={`${idGasto ? 'Edit' : 'Add'} Gasto`}
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
          <LabeledText label="IVA">{formatCurrency(importeIva)}</LabeledText>
          <LabeledText label="Importe sin IVA">
            {formatCurrency(importeSinIva)}
          </LabeledText>
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
