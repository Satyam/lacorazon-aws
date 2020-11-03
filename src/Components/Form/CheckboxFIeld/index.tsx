import React, { useState } from 'react';
import {
  FormGroup,
  Label,
  FormFeedback,
  FormText,
  Col,
  Input,
} from 'reactstrap';
import { UseFormMethods, ValidationRules } from 'react-hook-form';
import invariant from 'invariant';

let counter = 0;
/**
 * Produces a labeled input box within form
 */
const CheckboxField: React.FC<{
  name: string;
  label?: string;
  id?: string;
  help?: string;
  validation?: ValidationRules;
  methods: UseFormMethods<any>;
}> = ({ name, label, id, help, validation, methods, ...rest }) => {
  invariant(name, 'CheckboxField: name argument is mandatory');

  const [actualId] = useState(id || `F_TF_${counter}`);
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
          type="checkbox"
          name={name}
          invalid={hasError}
          id={actualId}
          style={{ marginLeft: '0' }}
          innerRef={validation ? register(validation) : register}
          {...rest}
        />
        {help && <FormText>{help}</FormText>}
        <FormFeedback>{error}</FormFeedback>
      </Col>
    </FormGroup>
  );
};

export default CheckboxField;
