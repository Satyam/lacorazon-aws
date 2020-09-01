import React from 'react';
import { Button, ButtonProps } from 'reactstrap';
import classNames from 'classnames/bind';
import {
  FaPlusCircle,
  FaRegTrashAlt,
  FaRegEdit,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaExclamationCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

import styles from './styles.module.css';
import { Link } from 'react-router-dom';

export type MyButtonProps = {
  color?: BootstrapColor;
  href?: string;
} & Omit<ButtonProps, 'color'>;

const cx = classNames.bind(styles);

export const MyButton: React.FC<MyButtonProps & { Icon: React.ReactType }> = ({
  Icon,
  href,
  children,
  color = 'primary',
  title = 'Agregar',
  ...props
}) => (
  <Button
    tag={href ? Link : undefined}
    color={color}
    title={title}
    {...props}
    to={href}
  >
    <Icon />
    {children && <span className={styles.label}>{children}</span>}
  </Button>
);

export const Icon: React.FC<{
  Component: React.ReactType;
  color?: BootstrapColor;
  isButton?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: React.EventHandler<any>;
}> = ({
  Component,
  color,
  isButton,
  disabled,
  className,
  onClick,
  ...props
}) => (
  <Component
    className={cx(className, {
      'active-icon': isButton && !disabled,
      [`icon-${color}`]: color,
      disabled: disabled,
    })}
    onClick={disabled ? undefined : onClick}
    {...props}
  />
);

export const IconAdd: React.FC<{ color?: BootstrapColor }> = ({
  color = 'primary',
  ...props
}) => <Icon Component={FaPlusCircle} {...props} />;

export const ButtonIconAdd: React.FC<MyButtonProps> = ({
  children,
  color = 'primary',
  title = 'Agregar',
  ...props
}) => (
  <MyButton Icon={FaPlusCircle} color={color} title={title} {...props}>
    {children}
  </MyButton>
);

export const IconDelete: React.FC<{ color?: BootstrapColor }> = ({
  color = 'danger',
  ...props
}) => <Icon Component={FaRegTrashAlt} {...props} />;

export const ButtonIconDelete: React.FC<MyButtonProps> = ({
  children,
  color = 'danger',
  title = 'Borrar',
  ...props
}) => (
  <MyButton Icon={FaRegTrashAlt} color={color} title={title} {...props}>
    {children}
  </MyButton>
);

export const IconEdit: React.FC<{ color?: BootstrapColor }> = ({
  color = 'secondary',
  ...props
}) => <Icon Component={FaRegEdit} {...props} />;

export const ButtonIconEdit: React.FC<MyButtonProps> = ({
  children,
  color = 'secondary',
  title = 'Modificar',
  ...props
}) => (
  <MyButton Icon={FaRegEdit} color={color} title={title} {...props}>
    {children}
  </MyButton>
);

export const IconView: React.FC<{ color?: BootstrapColor }> = ({
  color = 'info',
  ...props
}) => <Icon Component={FaEye} {...props} />;

export const ButtonIconView: React.FC<MyButtonProps> = ({
  children,
  color = 'info',
  title = 'Ver detalle',
  ...props
}) => (
  <MyButton Icon={FaEye} color={color} title={title} {...props}>
    {children}
  </MyButton>
);

export const IconCheck: React.FC<{ color?: BootstrapColor }> = ({
  color = 'success',
  ...props
}) => <Icon Component={FaCheckCircle} {...props} />;

export const ButtonIconCheck: React.FC<MyButtonProps> = ({
  children,
  color = 'success',
  ...props
}) => (
  <MyButton Icon={FaCheckCircle} color={color} {...props}>
    {children}
  </MyButton>
);

export const IconNotCheck: React.FC<{ color?: BootstrapColor }> = ({
  color = 'danger',
  ...props
}) => <Icon Component={FaTimesCircle} {...props} />;

export const ButtonIconNotCheck: React.FC<MyButtonProps> = ({
  children,
  color = 'warning',
  ...props
}) => (
  <MyButton Icon={FaTimesCircle} color={color} {...props}>
    {children}
  </MyButton>
);

export const IconCalendar: React.FC<{ color?: BootstrapColor }> = ({
  color = 'secondary',
  ...props
}) => <Icon Component={FaCalendarAlt} {...props} />;

export const ButtonIconCalendar: React.FC<MyButtonProps> = ({
  children,
  color = 'secondary',
  title = 'Calendario',
  ...props
}) => (
  <MyButton Icon={FaCalendarAlt} color={color} title={title} {...props}>
    {children}
  </MyButton>
);

export const IconWarning: React.FC<{ color?: BootstrapColor }> = ({
  color = 'warning',
  ...props
}) => <Icon Component={FaExclamationTriangle} {...props} />;

export const IconStop: React.FC<{ color?: BootstrapColor }> = ({
  color = 'danger',
  ...props
}) => <Icon Component={FaExclamationCircle} {...props} />;

export const ButtonSet: React.FC<{
  className?: string;
  size?: BootstrapSize;
}> = ({ className, children, size, ...rest }) => (
  <div className={cx('buttonSet', { [`btn-group-${size}`]: size }, className)}>
    {children}
  </div>
);
