import React from 'react';
import { useParams } from 'react-router-dom';

import { LabeledText, LabeledCheckbox } from 'Components/Form';
import { LabeledVendedores } from 'Components/vendedores/gadgets';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { Alert } from 'reactstrap';
import { useIntl } from 'Providers/Intl';

import { useVenta } from './common';

export default function ShowVenta() {
  const { id } = useParams<{ id: ID }>();
  const [venta, loading, error] = useVenta(id);

  const { formatDate, formatCurrency } = useIntl();

  if (loading) return <Loading>Cargando venta</Loading>;

  return (
    <Page
      title={`Venta - ${venta ? venta.fecha : '??'}`}
      heading={`Venta`}
      error={error}
    >
      {venta ? (
        <>
          <LabeledText
            label="Fecha"
            value={formatDate(new Date(venta.fecha))}
          />
          <LabeledText label="Concepto" value={venta.concepto} />
          <LabeledVendedores label="Vendedor" idVendedor={venta.idVendedor} />
          <LabeledText label="Cantidad" value={venta.cantidad} />
          <LabeledCheckbox label="IVA" value={venta.iva} />
          <LabeledText
            label="Precio Unitario"
            value={formatCurrency(venta.precioUnitario)}
          />
          <LabeledText
            label="Precio Total"
            value={formatCurrency(venta.precioUnitario! * venta.cantidad!)}
          />
        </>
      ) : (
        <Alert color="danger">La venta no existe o fue borrada</Alert>
      )}
    </Page>
  );
}
