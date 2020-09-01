import React from 'react';
import { Form } from 'reactstrap';

const MyForm: React.FC = ({ children, ...rest }) => {
  return <Form {...rest}>{children}</Form>;
};

export default MyForm;
