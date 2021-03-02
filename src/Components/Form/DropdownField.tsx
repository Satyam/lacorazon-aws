import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';

import { Input, InputProps } from 'reactstrap';
import { RegisterOptions } from 'react-hook-form';

export type DropdownFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: RegisterOptions;
    options: Record<string, string | number>[];
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
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Input>
    )}
  </LabelInputBox>
);

export default DropdownField;
