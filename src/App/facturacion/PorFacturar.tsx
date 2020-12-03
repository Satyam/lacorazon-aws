import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Alert, Form } from 'reactstrap';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// My own library imports
import {
  TextField,
  SubmitButton,
  LabeledText,
  DateField,
  PercentField,
  CurrencyField,
} from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import { useModals } from 'Providers/Modals';
import { useIntl } from 'Providers/Intl';
import { useDistribuidor } from 'App/distribuidor/common';
import { DropdownVendedores } from 'App/vendedores/gadgets';
import { DropdownIVA, calculoIVA } from 'App/iva/gadgets';

type FacturaType = {
  idDistribuidor: ID;
  fecha: Date;
  idVendedor: ID;
  importe: number;
  porcentaje: number;
  cantidad: number;
  iva: number;
};
const facturaSchema = yup.object().shape<FacturaType>({
  fecha: yup
    .date()
    .required()
    .default(() => new Date()),
  concepto: yup.string().trim().default(''),
  // @ts-ignore
  idVendedor: yup.string().nullable().default(null),
  cantidad: yup.number().required(),
  precioFijo: yup.boolean().default(false),
  porcentaje: yup.number().required(),
  importe: yup.number().required().default(0),
  // @ts-ignore
  iva: yup.number().default(0.04),
});
export default function PorFacturar() {
  const history = useHistory<{
    importe: number;
    porcentaje: number;
    cantidad: number;
    idvendedor: ID;
  }>();
  const { idDistribuidor } = useParams<{ idDistribuidor: ID }>();
  const [distribuidor, loading, error] = useDistribuidor(idDistribuidor);
  const { formatCurrency } = useIntl();
  const { state } = history.location;
  const defaultValues = {
    // @ts-ignore  until an update for @types/yup comes along
    ...facturaSchema.getDefault(),
    ...state,
    idVendedor: state.idvendedor,
  };
  const methods = useForm<FacturaType>({
    // @ts-ignore  until an update for @types/yup comes along
    defaultValues,
    resolver: yupResolver(facturaSchema),
  });

  if (error)
    return <ErrorAlert error={error}>Cargando distribuidor</ErrorAlert>;
  if (loading) return <Loading>Cargando distribuidor</Loading>;
  const onSubmit: SubmitHandler<FacturaType> = async (
    values
  ): Promise<void> => {
    if (idDistribuidor && distribuidor) {
    }
  };

  const { importe, iva } = methods.watch(['importe', 'iva']);
  const { importeIva, importeSinIva } = calculoIVA(importe, iva);
  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : 'nuevo'}`}
      heading={`${idDistribuidor ? 'Edit' : 'Add'} Distribuidor`}
    >
      {idDistribuidor && !distribuidor ? (
        <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
      ) : (
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <LabeledText label="Nombre">{distribuidor?.nombre}</LabeledText>
          <LabeledText label="Dirección">{distribuidor?.direccion}</LabeledText>
          <LabeledText label="NIF">{distribuidor?.nif}</LabeledText>
          <LabeledText label="Contacto">{distribuidor?.contacto}</LabeledText>
          <LabeledText label="Teléfono">{distribuidor?.telefono}</LabeledText>
          <LabeledText label="eMail">{distribuidor?.email}</LabeledText>
          <DateField label="fecha" name="fecha" methods={methods} />
          <DropdownVendedores
            label="Vendedor"
            name="idVendedor"
            methods={methods}
          />
          <CurrencyField label="Importe" name="importe" methods={methods} />
          <PercentField
            label="Porcentaje distribuidor"
            name="porcentaje"
            methods={methods}
          />
          <TextField label="Cantidad" name="cantidad" methods={methods} />
          <DropdownIVA label="IVA" name="iva" methods={methods} />
          <LabeledText label="Importe IVA">
            {formatCurrency(importeIva)}
          </LabeledText>
          <LabeledText label="Importe Sin IVA">
            {formatCurrency(importeSinIva)}
          </LabeledText>

          <h3>{idDistribuidor}</h3>
          <pre>{JSON.stringify(history.location.state, null, 2)}</pre>
        </Form>
      )}
    </Page>
  );
}
