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
  RadioField,
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

const facturaSchema = yup.object({
  fecha: yup
    .date()
    .required()
    .default(() => new Date()),
  concepto: yup.string().trim().default(''),
  idVendedor: yup.string().nullable().default(null),
  cantidad: yup.number().required(),
  precioFijo: yup.boolean().default(false),
  porcentaje: yup.number().required(),
  importe: yup.number().required().default(0),
  iva: yup.number().default(0.04),
});

type FacturaFormType = yup.Asserts<typeof facturaSchema>;

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
    ...facturaSchema.getDefault(),
    ...state,
    idVendedor: state.idvendedor,
    precioFijo: state.porcentaje > 1,
  };
  const methods = useForm<FacturaFormType>({
    defaultValues,
    resolver: yupResolver(facturaSchema),
  });

  if (error)
    return <ErrorAlert error={error}>Cargando distribuidor</ErrorAlert>;
  if (loading) return <Loading>Cargando distribuidor</Loading>;
  const onSubmit: SubmitHandler<FacturaFormType> = async (
    values
  ): Promise<void> => {
    if (idDistribuidor && distribuidor) {
    }
  };

  const { importe, iva, precioFijo } = methods.watch([
    'importe',
    'iva',
    'precioFijo',
  ]);
  console.log({ precioFijo });
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
          <LabeledText label="Distribuidor" style={{ height: 'inherit' }}>
            <h3>{distribuidor?.nombre}</h3>
            <pre>{distribuidor?.direccion}</pre>
            <div>NIF: {distribuidor?.nif}</div>
          </LabeledText>
          <DateField label="fecha" name="fecha" methods={methods} />
          <DropdownVendedores
            label="Vendedor"
            name="idVendedor"
            methods={methods}
          />
          <CurrencyField label="Importe" name="importe" methods={methods} />
          <RadioField
            label="Términos comisión"
            name="precioFijo"
            options={[
              { label: 'Porcentaje', value: false },
              { label: 'Precio Fijo', value: true },
            ]}
            methods={methods}
          />
          {precioFijo ? (
            <CurrencyField
              label="Precio distribuidor"
              name="porcentaje"
              methods={methods}
            />
          ) : (
            <PercentField
              label="Porcentaje distribuidor"
              name="porcentaje"
              methods={methods}
            />
          )}

          <TextField label="Cantidad" name="cantidad" methods={methods} />
          <DropdownIVA label="IVA" name="iva" methods={methods} />
          <LabeledText label="Importe IVA">
            {formatCurrency(importeIva)}
          </LabeledText>
          <LabeledText label="Importe Sin IVA">
            {formatCurrency(importeSinIva)}
          </LabeledText>
        </Form>
      )}
    </Page>
  );
}
