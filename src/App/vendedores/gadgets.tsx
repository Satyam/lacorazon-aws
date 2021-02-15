import React, { DOMAttributes } from 'react';
import { useVendedor, useVendedores } from './common';
import { Link } from 'react-router-dom';
import ErrorAlert from 'Components/ErrorAlert';
import icon from 'Components/Modals/loading.gif';
import { DropdownField, DropdownFieldProps } from '@satyam/react-form';
import { LabeledText, LabeledTextProps } from '@satyam/react-form';

export type DropdownVendedoresType = {
  idVendedor?: string;
} & Omit<DropdownFieldProps, 'options' | 'optLabel' | 'optValue'>;

export const DropdownVendedores: React.FC<DropdownVendedoresType> = ({
  idVendedor,
  name,
  methods,
  ...rest
}) => {
  const [vendedores = [], loading, error] = useVendedores();

  if (error) return <ErrorAlert error={error}>Cargando vendedores</ErrorAlert>;
  if (loading) return <img src={icon} alt="loading ..." />;
  if (vendedores) {
    return (
      <DropdownField
        {...rest}
        name={name}
        methods={methods}
        options={vendedores}
        optLabel="nombre"
        optValue="idVendedor"
      />
    );
  }
  return null;
};

export type LabeledVendedoresProps = {
  idVendedor?: string;
} & LabeledTextProps;

export const LabeledVendedores: React.FC<LabeledVendedoresProps> = ({
  idVendedor,
  ...rest
}) => {
  const [vendedor, loading, error] = useVendedor(idVendedor || '');
  if (error) return <ErrorAlert error={error}>Cargando vendedores</ErrorAlert>;
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
> = ({ idVendedor }) => {
  const [vendedor, loading, error] = useVendedor(idVendedor || '');
  if (error) return <ErrorAlert error={error}>Cargando vendedores</ErrorAlert>;
  if (loading) return <img src={icon} alt="loading ..." />;
  if (vendedor) {
    return (
      <Link title={vendedor.nombre} to={`/vendedor/${idVendedor}`}>
        {idVendedor}
      </Link>
    );
  }
  return null;
};
