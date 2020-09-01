import React, { DOMAttributes } from 'react';
import { FormGroup, Label, Col } from 'reactstrap';
import classNames from 'classnames/bind';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';
import styles from './styles.module.css';

const cx = classNames.bind(styles);

export const LabeledText: React.FC<
  {
    label: string;
    value: any;
    pre?: boolean;
    className?: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ label, value, children, pre, className, ...rest }) => (
  <FormGroup row>
    <Label xs={12} lg={2}>
      {label}
    </Label>
    <Col xs={12} lg={8}>
      <div
        className={cx(
          'form-control',
          'readonly',
          { 'labeled-pre': pre },
          className
        )}
        {...rest}
      >
        {value}
        {children}
      </div>
    </Col>
  </FormGroup>
);

export const LabeledCheckbox: React.FC<{
  label: string;
  value?: any;
  checked?: boolean;
  className?: string;
}> = ({ label, value, checked, className, ...rest }) => (
  <FormGroup row>
    <Label xs={12} lg={2}>
      {label}
    </Label>
    <Col xs={12} lg={8}>
      <div
        style={{ backgroundColor: 'var(--light)' }}
        className={classNames('form-control', 'border-0', className)}
        {...rest}
      >
        {value || checked ? <FaRegCheckSquare /> : <FaRegSquare />}
      </div>
    </Col>
  </FormGroup>
);
