import React, { useState } from 'react';
import {
  FormGroup,
  Label,
  FormFeedback,
  FormText,
  Col,
  Input,
} from 'reactstrap';
import { ValidationRules, UseFormMethods } from 'react-hook-form';
import invariant from 'invariant';

let counter = 0;

const DropdownField: React.FC<{
  name: string;
  optValue?: string;
  optLabel?: string;
  options: { [index: string]: string | number }[];
  noOption: boolean;
  label?: string;
  id?: string;
  rows?: number;
  help?: string;
  validation?: ValidationRules;
  methods: UseFormMethods<any>;
}> = ({
  name,
  label,
  id,
  options,
  optValue = 'id',
  optLabel = 'nombre',
  help,
  noOption,
  validation,
  methods,
  ...rest
}) => {
  invariant(name, 'DropdownField: name argument is mandatory');
  invariant(options, 'DropdownField: options argument is mandatory');

  const [actualId] = useState(id || `F_DDF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  const { register, errors } = methods;

  const hasError = name in errors;
  const error = hasError && (errors[name]?.message || errors[name]);

  return (
    <FormGroup row>
      <Label for={actualId} xs={12} lg={2}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        <Input
          type="select"
          invalid={hasError}
          name={name}
          id={actualId}
          innerRef={validation ? register(validation) : register}
          {...rest}
        >
          {noOption && (
            <option key=" " value="">
              {' ----   '}
            </option>
          )}
          {options.map((o) => (
            <option key={o[optValue]} value={o[optValue]}>
              {o[optLabel]}
            </option>
          ))}
        </Input>

        {help && <FormText>{help}</FormText>}
        <FormFeedback>{error}</FormFeedback>
      </Col>
    </FormGroup>
  );
};

export default DropdownField;
