import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';

import { Input, InputProps, InputGroup, InputGroupAddon } from 'reactstrap';
import { RegisterOptions, Controller } from 'react-hook-form';
import { useIntl } from 'Providers/Intl';
export type CurrencyFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: RegisterOptions;
  };

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  name,
  type,
  label,
  id,
  help,
  validation,
  methods,
  ...rest
}) => {
  const { currencySign, currencySignPrepend, formatCurrency } = useIntl();
  return (
    <LabelInputBox name={name} label={label} id={id} methods={methods}>
      {({ name, id, hasError, methods }) => (
        <InputGroup>
          {currencySignPrepend && (
            <InputGroupAddon addonType="prepend">
              {currencySign}
            </InputGroupAddon>
          )}
          <Controller
            render={({ onBlur, onChange, name, value, ref }) => {
              return (
                <Input
                  name={name}
                  type="text"
                  onChange={(ev) =>
                    onChange(parseFloat(ev.target.value.replace(',', '.')))
                  }
                  onBlur={onBlur}
                  ref={ref}
                  defaultValue={formatCurrency(value, true)}
                  invalid={hasError}
                  id={id}
                  innerRef={
                    validation ? methods.register(validation) : methods.register
                  }
                  {...rest}
                />
              );
            }}
            name={name}
            control={methods.control}
            rules={validation}
            defaultValue={methods.getValues(name)}
          />
          {!currencySignPrepend && (
            <InputGroupAddon addonType="append">{currencySign}</InputGroupAddon>
          )}
        </InputGroup>
      )}
    </LabelInputBox>
  );
};

export default CurrencyField;
