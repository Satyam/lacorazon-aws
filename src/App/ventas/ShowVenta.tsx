import React from 'react';
import { useParams } from 'react-router-dom';

import { LabeledText, LabeledCheckbox } from '@satyam/react-form';
import { LabeledVendedores } from 'App/vendedores/gadgets';
import { LabeledCuentas } from 'App/cuentas/gadgets';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { ErrorAlert } from 'Components/ErrorAlert';
import { Alert } from 'reactstrap';
import { useIntl } from 'Providers/Intl';

import { useVenta } from './common';

export default function ShowVenta() {
  const { idVenta } = useParams<{ idVenta: ID }>();
  const [venta, loading, error] = useVenta(idVenta);

  const { formatDate, formatCurrency } = useIntl();
  if (error) return <ErrorAlert error={error}>Cargando venta</ErrorAlert>;
  if (loading) return <Loading>Cargando venta</Loading>;

  return (
    <Page title={`Venta - ${venta ? venta.fecha : '??'}`} heading={`Venta`}>
      {venta ? (
        <>
          <LabeledText label="Fecha">
            {formatDate(new Date(venta.fecha))}
          </LabeledText>
          <LabeledText label="Concepto">{venta.concepto}</LabeledText>
          <LabeledVendedores label="Vendedor" idVendedor={venta.idVendedor} />
          <LabeledText label="Cantidad">{venta.cantidad}</LabeledText>
          <LabeledCheckbox label="IVA">{venta.iva}</LabeledCheckbox>
          <LabeledText label="Precio Unitario">
            {formatCurrency(venta.precioUnitario)}
          </LabeledText>
          <LabeledText label="Precio Total">
            {formatCurrency(venta.precioUnitario! * venta.cantidad!)}
          </LabeledText>
          <LabeledCuentas label="Cuenta" idCuenta={venta.cuenta} />
        </>
      ) : (
        <Alert color="danger">La venta no existe o fue borrada</Alert>
      )}
    </Page>
  );
}
