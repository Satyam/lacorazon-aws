import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';

import { Input, InputProps } from 'reactstrap';
import { ValidationRules } from 'react-hook-form';

export type TextFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: ValidationRules;
  };

export const TextField: React.FC<TextFieldProps> = ({
  name,
  type,
  label,
  id,
  rows,
  help,
  validation,
  methods,
  ...rest
}) => (
  <LabelInputBox name={name} label={label} id={id} methods={methods}>
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
