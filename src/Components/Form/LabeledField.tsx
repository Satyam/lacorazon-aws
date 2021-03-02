import React, { DOMAttributes } from 'react';
import { LabelBox, LabelBoxProps } from './LabelBox';

import classNames from 'classnames/bind';
import { Checkmark } from '@bit/satyam.components.icons-and-buttons';
import styles from './styles.module.css';

const cx = classNames.bind(styles);

export type LabeledTextProps = LabelBoxProps & {
  pre?: boolean;
  className?: string;
} & DOMAttributes<HTMLDivElement>;

export const LabeledText: React.FC<LabeledTextProps> = ({
  label,
  help,
  children,
  pre,
  className,
  ...rest
}) => (
  <LabelBox label={label} help={help}>
    <div
      className={cx(
        'form-control',
        'readonly',
        { 'labeled-pre': pre },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  </LabelBox>
);

export type LabeledCheckboxProps = LabelBoxProps & {
  checked?: boolean;
  className?: string;
} & DOMAttributes<HTMLDivElement>;

export const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
  label,
  help,
  checked,
  className,
  ...rest
}) => (
  <LabelBox label={label} help={help}>
    <div
      style={{ backgroundColor: 'var(--light)' }}
      className={classNames('form-control', 'border-0', className)}
      {...rest}
    >
      <Checkmark value={checked} />
    </div>
  </LabelBox>
);
