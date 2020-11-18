import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from '../LabelBox';

import { Input, InputProps } from 'reactstrap';
import { ValidationRules } from 'react-hook-form';

export type DropdownFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: ValidationRules;
    optValue?: string;
    optLabel?: string;
    options:
      | Record<string, string | number>[]
      | Record<string, string | number>;
    noOption?: boolean;
  };

export const DropdownField: React.FC<DropdownFieldProps> = ({
  name,
  label,
  id,
  options,
  optValue = 'id',
  optLabel = 'nombre',
  help,
  noOption = false,
  validation,
  methods,
  ...rest
}) => (
  <LabelInputBox name={name} label={label} id={id} methods={methods}>
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
