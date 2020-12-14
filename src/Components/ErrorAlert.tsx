import React from 'react';
import { Alert } from 'reactstrap';

export type ErrorAlertError = any;
// | Error
// | string
// | Array<Error | string | undefined>;
//
export const ErrorAlert: React.FC<{ error?: ErrorAlertError }> = ({
  error,
  children,
}) => {
  if (!error) return null;
  let e = '';
  if (typeof error === 'string') e = error;
  if (error instanceof Error) e = error.toString();
  if (Array.isArray(error)) {
    e = error.reduce<string>(
      (errors, err) => (err ? errors + '\n' + err.toString() : errors),
      ''
    );
  }

  return e.length ? (
    <Alert color="danger">
      {children}
      <pre>{e}</pre>
    </Alert>
  ) : null;
};
export default ErrorAlert;
