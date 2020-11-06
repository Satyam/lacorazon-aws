import React, { DOMAttributes } from 'react';
import { db } from 'Firebase';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import icon from 'Components/Modals/loading.gif';
import { DropdownField, LabeledText } from 'Components/Form';
import { UseFormMethods } from 'react-hook-form';

export const DropdownVendedores: React.FC<
  {
    idVendedor?: string;

    // for DropdownField
    name: string;
    noOption: boolean;
    label?: string;
    id?: string;
    rows?: number;
    help?: string;
    methods: UseFormMethods<any>;
    className?: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ idVendedor, ...rest }) => {
  const [vendedores, loading, error] = useListVals<VendedorType>(
    db.ref('vendedores')
  );

  if (error) return <Alert color="danger">{error}</Alert>;
  if (loading) return <img src={icon} alt="loading ..." />;
  if (vendedores) {
    return (
      <DropdownField
        {...rest}
        options={vendedores}
        optLabel="nombre"
        optValue="idVendedor"
      />
    );
  }
  return null;
};

export const LabeledVendedores: React.FC<
  {
    idVendedor: string;
    label: string;
    help?: string;
    className?: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ idVendedor, ...rest }) => {
  const [vendedor, loading, error] = useObjectVal<VendedorType>(
    db.ref(`vendedores/${idVendedor}`)
  );
  if (error) return <Alert color="danger">{error}</Alert>;
  if (loading) return <img src={icon} alt="loading ..." />;
  if (vendedor) {
    return (
      <LabeledText {...rest}>
        <Link title={vendedor.email} to={`/vendedores/${idVendedor}`}>
          {vendedor.nombre}
        </Link>
      </LabeledText>
    );
  }
  return null;
};

export const ShowVendedor: React.FC<
  {
    idVendedor: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ idVendedor, ...rest }) => {
  const [vendedor, loading, error] = useObjectVal<VendedorType>(
    db.ref(`vendedores/${idVendedor}`)
  );
  if (error) return <Alert color="danger">{error}</Alert>;
  if (loading) return <img src={icon} alt="loading ..." />;
  if (vendedor) {
    return (
      <span {...rest} title={vendedor.nombre}>
        {idVendedor}
      </span>
    );
  }
  return null;
};
