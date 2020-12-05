import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';
import { Input, InputProps } from 'reactstrap';
import { RegisterOptions, Controller } from 'react-hook-form';
import styles from './styles.module.css';
export type RadioFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: RegisterOptions;
    options: {
      label: string;
      value: any;
      disabled?: boolean;
    }[];
  };

export const RadioField: React.FC<RadioFieldProps> = ({
  // for LabelInputBox
  name,
  label,
  id,
  help,
  methods,
  // for form
  validation,
  options,
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
      <Controller
        render={({ onBlur, onChange, name, value, ref }) => {
          return (
            <ul className={styles.radioUl}>
              {options.map((opt) => (
                <li key={opt.value}>
                  <Input
                    type="radio"
                    name={name}
                    invalid={hasError}
                    id={id}
                    innerRef={ref}
                    disabled={opt.disabled}
                    defaultChecked={value === opt.value}
                    onChange={(ev) => onChange(opt.value)}
                    onBlur={onBlur}
                    {...rest}
                  />
                  {opt.label}
                </li>
              ))}
            </ul>
          );
        }}
        name={name}
        control={methods.control}
        rules={validation}
        defaultValue={methods.getValues(name)}
      />
    )}
  </LabelInputBox>
);

export default RadioField;
