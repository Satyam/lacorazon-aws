import React from 'react';
import { Button } from 'reactstrap';
import { MyButtonProps } from 'Components/Icons';
import { UseFormMethods } from 'react-hook-form';

export type SubmitButtonProps = MyButtonProps & {
  component?: React.ComponentType<MyButtonProps>;
  methods: UseFormMethods<any>;
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  component: Component = Button,
  methods,
  ...rest
}) => {
  const {
    errors,
    formState: { isSubmitting, isDirty },
  } = methods;

  return (
    <Component
      type="submit"
      disabled={isSubmitting || !isDirty || !!Object.keys(errors).length}
      {...rest}
    />
  );
};

export default SubmitButton;
