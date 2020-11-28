import React from 'react';
import icon from './loading.gif';
import { Modal, ModalHeader, ModalBody, ModalHeaderProps } from 'reactstrap';
import styles from './styles.module.css';

const Loading: React.FC<
  {
    title?: string;
    noIcon?: boolean;
    isOpen?: boolean;
  } & ModalHeaderProps
> = ({
  title = 'Cargando ....',
  children,
  noIcon,
  isOpen = true,
  ...props
}) => (
  <Modal isOpen={isOpen} {...props}>
    <ModalHeader className={styles.loadingHeader}>{title}</ModalHeader>
    <ModalBody className={styles.loadingContainer}>
      {children}
      {!noIcon && (
        <img className={styles.loadingImg} src={icon} alt="loading..." />
      )}
    </ModalBody>
  </Modal>
);

export default Loading;
