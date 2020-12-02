import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';
import { Controller, RegisterOptions } from 'react-hook-form';
import { Input, InputProps, InputGroup, InputGroupAddon } from 'reactstrap';

export type PercentFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: RegisterOptions;
  };

export const PercentField: React.FC<PercentFieldProps> = ({
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
}) => {
  return (
    <LabelInputBox
      name={name}
      label={label}
      id={id}
      help={help}
      methods={methods}
    >
      {({ name, id, hasError, methods }) => {
        return (
          <Controller
            render={({ onBlur, onChange, name, value, ref }) => {
              return (
                <InputGroup>
                  <Input
                    name={name}
                    type="number"
                    invalid={hasError}
                    id={id}
                    // innerRef={ref}
                    onBlur={onBlur}
                    onChange={(ev) => {
                      onChange(parseFloat(ev.target.value || '0') / 100);
                    }}
                    value={value ? value * 100 : 0}
                    {...rest}
                  />
                  <InputGroupAddon addonType="append">%</InputGroupAddon>
                </InputGroup>
              );
            }}
            name={name}
            control={methods.control}
            rules={validation}
            defaultValue={methods.getValues(name)}
          />
        );
      }}
    </LabelInputBox>
  );
};

export default PercentField;
