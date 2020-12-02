import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';
import { Input, InputProps } from 'reactstrap';
import { RegisterOptions } from 'react-hook-form';

export type CheckboxFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: RegisterOptions;
  };

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  // for LabelInputBox
  name,
  label,
  id,
  help,
  methods,
  // for form
  validation,
  // for Input
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
        type="checkbox"
        name={name}
        invalid={hasError}
        id={id}
        style={{ marginLeft: '0' }}
        innerRef={validation ? methods.register(validation) : methods.register}
        {...rest}
      />
    )}
  </LabelInputBox>
);

export default CheckboxField;
