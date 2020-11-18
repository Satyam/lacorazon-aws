import React, { DOMAttributes } from 'react';
import { Badge } from 'reactstrap';

import { LabeledText, LabeledTextProps } from 'Components/Form/LabeledField';
import {
  DropdownField,
  DropdownFieldProps,
} from 'Components/Form/DropdownField';
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

export type DropdownCuentasType = {
  idCuenta?: string;
} & Omit<DropdownFieldProps, 'options' | 'optLabel' | 'optValue'>;

export const DropdownCuentas: React.FC<DropdownCuentasType> = ({
  idCuenta,
  name,
  methods,
  ...rest
}) => {
  return (
    <DropdownField
      {...rest}
      name={name}
      methods={methods}
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
  } & LabeledTextProps
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
