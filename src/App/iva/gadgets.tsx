import React, { DOMAttributes } from 'react';

import { LabeledText, LabeledTextProps } from '@satyam/react-form';

import { DropdownField, DropdownFieldProps } from '@satyam/react-form';

import { configs } from 'App/config';
export type DropdownIVAType = Omit<DropdownFieldProps, 'options'>;

export const DropdownIVA: React.FC<DropdownIVAType> = ({
  name,
  methods,
  ...rest
}) => {
  return (
    <DropdownField
      {...rest}
      name={name}
      methods={methods}
      options={configs.IVAs.map((iva) => ({
        value: iva,
        label: `${iva * 100}%`,
      }))}
    />
  );
};

export const LabeledIVA: React.FC<
  {
    iva?: number;
    label: string;
    help?: string;
    className?: string;
  } & LabeledTextProps
> = ({ iva, ...rest }) => {
  return <LabeledText {...rest}>{iva ? `${iva * 100}%` : null}</LabeledText>;
};

export const ShowIVA: React.FC<
  {
    iva?: number;
  } & DOMAttributes<HTMLDivElement>
> = ({ iva, ...rest }) => <span {...rest}>{iva ? `${iva * 100}%` : null}</span>;

export const calculoIVA: (
  importeTotal?: number,
  iva?: number | string
) => { importeIva: number; importeSinIva: number } = (
  importeTotal = 0,
  iva = 0
) => {
  const importeSinIva: number =
    Math.round((importeTotal / (1 + Number(iva))) * 100) / 100;
  const importeIva: number = importeTotal - importeSinIva;
  return { importeIva, importeSinIva };
};
