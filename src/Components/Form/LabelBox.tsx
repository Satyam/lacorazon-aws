import React, { useState, useEffect } from 'react';
import { FormGroup, Label, FormFeedback, FormText, Col } from 'reactstrap';
import { UseFormMethods } from 'react-hook-form';

type RenderProps = {
  id: string;
  name: string;
  methods: UseFormMethods<any>;
  hasError: boolean;
};

export type LabelBoxProps = {
  label?: string;
  help?: string;
  className?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export type LabelInputBoxProps = LabelBoxProps & {
  name: string;
  id?: string;
  methods: UseFormMethods<any>;
};

let counter = 0;

export const LabelInputBox: React.FC<
  LabelInputBoxProps & { children: (props: RenderProps) => React.ReactNode }
> = ({ name, label, id, help, methods, children, ...rest }) => {
  const [actualId, setId] = useState<string>('');
  useEffect(() => {
    setId(id || `F_${counter}`);
    if (!id) counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  }, [id]);
  const { errors } = methods;
  const hasError = name in errors;
  const error = hasError && (errors[name]?.message || errors[name]);
  return (
    <LabelBox label={label} help={help} htmlFor={actualId} {...rest}>
      {children({ id: actualId, name, methods, hasError })}
      {/* See: https://github.com/reactstrap/reactstrap/issues/1619 */}
      <FormFeedback className={hasError ? 'd-block' : 'd-none'}>
        {error}
      </FormFeedback>
    </LabelBox>
  );
};

export const LabelBox: React.FC<LabelBoxProps> = ({
  label,
  help,
  className,
  children,
  ...rest
}) => {
  return (
    <FormGroup row className={className}>
      <Label xs={12} lg={2} {...rest}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        {children}
        {help && <FormText color="info">{help}</FormText>}
      </Col>
    </FormGroup>
  );
};

export default LabelBox;
