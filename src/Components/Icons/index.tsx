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
  FaRegCheckSquare,
  FaRegSquare,
  FaFileInvoiceDollar,
  FaInfoCircle,
} from 'react-icons/fa';
import { AiOutlineDollarCircle } from 'react-icons/ai';

import styles from './styles.module.css';
import { Link } from 'react-router-dom';

export type MyButtonProps = {
  color?: BootstrapColor;
  href?: string;
} & Omit<ButtonProps, 'color'>;

const cx = classNames.bind(styles);

export const MyButton: React.FC<
  MyButtonProps & { Icon: React.ElementType }
> = ({
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

export type IconProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  Component: React.ElementType;
  color?: BootstrapColor;
  isButton?: boolean;
  disabled?: boolean;
  size?: string;
};
export const Icon: React.FC<IconProps> = ({
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

export const IconAdd: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'primary',
  ...props
}) => <Icon Component={FaPlusCircle} color={color} {...props} />;

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

export const IconDelete: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'danger',
  ...props
}) => <Icon Component={FaRegTrashAlt} color={color} {...props} />;

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

export const IconEdit: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'secondary',
  ...props
}) => <Icon Component={FaRegEdit} color={color} {...props} />;

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

export const IconView: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'info',
  ...props
}) => <Icon Component={FaEye} color={color} {...props} />;

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

export const IconCheck: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'success',
  ...props
}) => <Icon Component={FaCheckCircle} color={color} {...props} />;

export const ButtonIconCheck: React.FC<MyButtonProps> = ({
  children,
  color = 'success',
  ...props
}) => (
  <MyButton Icon={FaCheckCircle} color={color} {...props}>
    {children}
  </MyButton>
);

export const IconNotCheck: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'danger',
  ...props
}) => <Icon Component={FaTimesCircle} color={color} {...props} />;

export const ButtonIconNotCheck: React.FC<MyButtonProps> = ({
  children,
  color = 'warning',
  ...props
}) => (
  <MyButton Icon={FaTimesCircle} color={color} {...props}>
    {children}
  </MyButton>
);

export const IconCalendar: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'secondary',
  ...props
}) => <Icon Component={FaCalendarAlt} color={color} {...props} />;

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

export const IconWarning: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'warning',
  ...props
}) => <Icon Component={FaExclamationTriangle} color={color} {...props} />;

export const IconStop: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'danger',
  ...props
}) => <Icon Component={FaExclamationCircle} color={color} {...props} />;

export const ButtonSet: React.FC<{
  className?: string;
  size?: BootstrapSize;
}> = ({ className, children, size, ...rest }) => (
  <div className={cx('buttonSet', { [`btn-group-${size}`]: size }, className)}>
    {children}
  </div>
);

export const Checkmark: React.FC<{ value?: boolean }> = ({ value = false }) =>
  value ? <FaRegCheckSquare /> : <FaRegSquare />;

export const ButtonIconInvoice: React.FC<MyButtonProps> = ({
  children,
  color = 'secondary',
  title = 'Facturar',
  ...props
}) => (
  <MyButton Icon={FaFileInvoiceDollar} color={color} title={title} {...props}>
    {children}
  </MyButton>
);

export const ButtonIconCobrar: React.FC<MyButtonProps> = ({
  children,
  color = 'secondary',
  title = 'Cobrar',
  ...props
}) => (
  <MyButton Icon={AiOutlineDollarCircle} color={color} title={title} {...props}>
    {children}
  </MyButton>
);

export const IconInfo: React.FC<Omit<IconProps, 'Component'>> = ({
  color = 'info',
  ...props
}) => <Icon Component={FaInfoCircle} color={color} {...props} />;
