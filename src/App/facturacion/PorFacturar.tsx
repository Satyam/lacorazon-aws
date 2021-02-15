import React, { useMemo, useEffect } from 'react';
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
} from '@satyam/react-form';
import { ButtonIconAdd, ButtonSet } from '@satyam/react-form';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useModals } from 'Providers/Modals';

import { ErrorAlert } from 'Components/ErrorAlert';
import { useIntl } from '@satyam/react-form';
import { useDistribuidor } from 'App/distribuidor/common';
import { useFacturaciones, createFacturacion } from 'App/facturacion/common';
import { DropdownVendedores } from 'App/vendedores/gadgets';
import { DropdownIVA, calculoIVA } from 'App/iva/gadgets';

import configs from 'App/config';
const { precioDescontado, comisionEstandar } = configs;

const factRegExp = /E(\d+)-(\d+)/i;

const facturaSchema = yup.object({
  fecha: yup
    .date()
    .required()
    .default(() => new Date()),
  nroFactura: yup.string().required().default(''),
  concepto: yup.string().trim().default(''),
  idVendedor: yup.string().default(null),
  cantidad: yup.number().required().default(1),
  precioFijo: yup.boolean().default(false),
  porcentaje: yup.number().required().lessThan(1).default(comisionEstandar),
  precioPorUnidad: yup.number().min(1).default(precioDescontado),
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
  const [facturas = [], loadingFacturas, errorFacturas] = useFacturaciones();
  const { formatCurrency } = useIntl();
  const { openLoading, closeLoading } = useModals();
  const { state } = history.location;

  const nroFactura = useMemo<string>(() => {
    const lastFactura = facturas
      .filter((f) => f.nroFactura)
      .sort((a, b) => {
        if (a.nroFactura < b.nroFactura) return -1;
        if (a.nroFactura > b.nroFactura) return 1;
        return 0;
      })
      .pop();

    if (lastFactura) {
      const m = factRegExp.exec(lastFactura.nroFactura);
      if (m && m.length === 3) {
        const anyo = parseInt(m[1], 10);
        const thisYear = new Date().getFullYear() % 100;
        const nro = parseInt(m[2], 10);
        if (thisYear === anyo) {
          return `E${m[1]}-${String(nro + 1).padStart(3, '0')}`;
        }
        return `E${thisYear}-001`;
      }
    }
    return '';
  }, [facturas]);

  const methods = useForm<FacturaFormType>({
    defaultValues: facturaSchema.getDefault(),
    resolver: yupResolver(facturaSchema),
  });

  useEffect(() => {
    methods.reset({
      ...facturaSchema.getDefault(),
      ...state,
      idVendedor: state.idvendedor,
      precioFijo: state.porcentaje > 1,
      porcentaje: state.porcentaje < 1 ? state.porcentaje : comisionEstandar,
      precioPorUnidad:
        state.porcentaje < 1 ? precioDescontado : state.porcentaje,
      nroFactura,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nroFactura, state]);

  const { importe, iva, precioFijo } = methods.watch([
    'importe',
    'iva',
    'precioFijo',
  ]);

  if (error)
    return <ErrorAlert error={error}>Cargando distribuidor</ErrorAlert>;
  if (errorFacturas)
    return <ErrorAlert error={errorFacturas}>Cargando facturas</ErrorAlert>;

  const onSubmit: SubmitHandler<FacturaFormType> = async (
    values
  ): Promise<void> => {
    if (idDistribuidor && distribuidor) {
      openLoading('Creando Factura');
      const {
        precioFijo,
        porcentaje,
        precioPorUnidad,
        importe,
        ...rest
      } = values;

      const idFactura = await createFacturacion({
        ...rest,
        porcentaje: precioFijo ? precioPorUnidad : porcentaje,
        facturado: importe,
        idDistribuidor,
      });
      history.replace(`/factura/${idFactura}`);
      closeLoading();
    }
  };

  const { importeIva, importeSinIva } = calculoIVA(importe, iva);
  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : 'nuevo'}`}
      heading={`${idDistribuidor ? 'Edit' : 'Add'} Distribuidor`}
    >
      {loading && <Loading>Cargando distribuidor</Loading>}
      {loadingFacturas && <Loading>Cargando facturas</Loading>}
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
          <TextField label="Nro. Factura" name="nroFactura" methods={methods} />
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
              name="precioPorUnidad"
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
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd} methods={methods}>
              Facturar
            </SubmitButton>
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
}
