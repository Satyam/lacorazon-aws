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

export type MyButtonProps = {
  color?: BootstrapColor;
} & Omit<ButtonProps, 'color'>;
const cx = classNames.bind(styles);

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
  <Button color={color} title={title} {...props}>
    <FaPlusCircle />
    <span className={styles.label}>{children}</span>
  </Button>
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
  <Button color={color} title={title} {...props}>
    <FaRegTrashAlt />
    <span className={styles.label}>{children}</span>
  </Button>
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
  <Button color={color} title={title} {...props}>
    <FaRegEdit />
    <span className={styles.label}>{children}</span>
  </Button>
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
  <Button color={color} title={title} {...props}>
    <FaEye />
    <span className={styles.label}>{children}</span>
  </Button>
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
  <Button color={color} {...props}>
    <FaCheckCircle />
    <span className={styles.label}>{children}</span>
  </Button>
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
  <Button color={color} {...props}>
    <FaTimesCircle />
    <span className={styles.label}>{children}</span>
  </Button>
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
  <Button color={color} title={title} {...props}>
    <FaCalendarAlt />
    <span className={styles.label}>{children}</span>
  </Button>
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
