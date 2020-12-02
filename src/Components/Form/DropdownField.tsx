import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';

import { Input, InputProps } from 'reactstrap';
import { RegisterOptions } from 'react-hook-form';

export type DropdownFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: RegisterOptions;
    optValue?: string;
    optLabel?: string;
    options:
      | Record<string, string | number>[]
      | Record<string, string | number>;
    noOption?: boolean;
  };

export const DropdownField: React.FC<DropdownFieldProps> = ({
  // for LabelInputBox
  name,
  label,
  id,
  help,
  methods,
  // for form
  validation,
  // for dropdown
  options,
  optValue = 'id',
  optLabel = 'nombre',
  noOption = false,
  ...rest
}) => (
  <LabelInputBox
    name={name}
    label={label}
    id={id}
    help={help}
    methods={methods}
  >
    {({ name, id, hasError, methods }) => (
      <Input
        type="select"
        invalid={hasError}
        name={name}
        id={id}
        innerRef={validation ? methods.register(validation) : methods.register}
        {...rest}
      >
        {noOption && (
          <option key=" " value="">
            {' ----   '}
          </option>
        )}
        {Array.isArray(options)
          ? options.map((o) => (
              <option key={o[optValue]} value={o[optValue]}>
                {o[optLabel]}
              </option>
            ))
          : Object.keys(options).map((key) => (
              <option key={key} value={key}>
                {options[key]}
              </option>
            ))}
      </Input>
    )}
  </LabelInputBox>
);

export default DropdownField;
