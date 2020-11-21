import React from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';

import { Input, InputProps, InputGroup, InputGroupAddon } from 'reactstrap';
import { ValidationRules } from 'react-hook-form';
import { useIntl } from 'Providers/Intl';
export type CurrencyFieldProps = LabelInputBoxProps &
  InputProps & {
    validation?: ValidationRules;
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
  const { currencySign, currencySignPrepend, currencyDecimals } = useIntl();
  return (
    <LabelInputBox name={name} label={label} id={id} methods={methods}>
      {({ name, id, hasError, methods }) => (
        <InputGroup>
          {currencySignPrepend && (
            <InputGroupAddon addonType="prepend">
              {currencySign}
            </InputGroupAddon>
          )}
          <Input
            name={name}
            type="number"
            step={10 ** -currencyDecimals}
            invalid={hasError}
            id={id}
            innerRef={
              validation ? methods.register(validation) : methods.register
            }
            {...rest}
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
