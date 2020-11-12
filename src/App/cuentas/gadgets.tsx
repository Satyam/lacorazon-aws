import React, { DOMAttributes } from 'react';
import { Badge } from 'reactstrap';
import { DropdownField, LabeledText } from 'Components/Form';
import { UseFormMethods } from 'react-hook-form';

export const cuentas: Record<ID, CuentaType> = {
  ctaRaed: {
    idCuenta: 'ctaRaed',
    descr: 'Cuenta Raed',
    color: 'lightgreen',
  },
  efvoRoxy: {
    idCuenta: 'efvoRoxy',
    descr: 'Efectivo Roxy',
    color: 'orange',
  },
};

export const DropdownCuentas: React.FC<
  {
    idCuenta?: string;

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
> = ({ idCuenta, ...rest }) => {
  return (
    <DropdownField
      {...rest}
      options={Object.values(cuentas)}
      optLabel="descr"
      optValue="idCuenta"
    />
  );
};

export const LabeledCuentas: React.FC<
  {
    idCuenta?: string;
    label: string;
    help?: string;
    className?: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ idCuenta, ...rest }) => {
  return (
    <LabeledText {...rest}>
      {typeof idCuenta === 'undefined' ? '' : cuentas[idCuenta].descr}
    </LabeledText>
  );
};

export const ShowCuenta: React.FC<
  {
    idCuenta?: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ idCuenta, ...rest }) => {
  const cta = cuentas[idCuenta || ''];
  return idCuenta ? (
    <Badge
      {...rest}
      title={cta.descr}
      style={{ color: 'white', backgroundColor: cta.color }}
    >
      {idCuenta}
    </Badge>
  ) : null;
};
