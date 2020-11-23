import React, { DOMAttributes } from 'react';

import { LabeledText, LabeledTextProps } from 'Components/Form/LabeledField';

import {
  DropdownField,
  DropdownFieldProps,
} from 'Components/Form/DropdownField';

import { configs } from 'App/config';
export type DropdownIVAType = Omit<
  DropdownFieldProps,
  'options' | 'optLabel' | 'optValue'
>;

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
      options={configs.IVAs.reduce(
        (opts, iva) => ({
          ...opts,
          [iva]: `${iva * 100}%`,
        }),
        {}
      )}
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
