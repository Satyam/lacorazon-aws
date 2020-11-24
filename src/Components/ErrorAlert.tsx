import React from 'react';
import { Alert } from 'reactstrap';
const ErrorAlert: React.FC<{ error?: Error | string }> = ({
  error,
  children,
}) =>
  error ? (
    <Alert color="danger">
      {children}
      <pre>{error.toString()}</pre>
    </Alert>
  ) : null;

export default ErrorAlert;
