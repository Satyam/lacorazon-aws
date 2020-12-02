import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';

import { Input, InputProps } from 'reactstrap';
import { RegisterOptions } from 'react-hook-form';

export type TextFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: RegisterOptions;
  };

export const TextField: React.FC<TextFieldProps> = ({
  // For LabelInputBox
  name,
  label,
  id,
  help,
  methods,
  // for react-hooks-form
  validation,
  // for Input
  type,
  rows,
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
        name={name}
        type={type || (rows ? 'textarea' : 'text')}
        invalid={hasError}
        rows={rows}
        id={id}
        innerRef={validation ? methods.register(validation) : methods.register}
        {...rest}
      />
    )}
  </LabelInputBox>
);

export default TextField;
