import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import styles from './styles.module.css';

const ConfirmDelete: React.FC<{
  descr?: string;
  onClose: (result: boolean) => void;
}> = ({ descr, onClose }) => (
  <Modal isOpen={!!descr}>
    <ModalHeader className={styles.confirmDeleteHeader}>
      Confirmación borrado
    </ModalHeader>
    <ModalBody className={styles.confirmDeleteBody}>
      {`¿Está seguro que desea borrar ${descr} ?`}
    </ModalBody>
    <ModalFooter>
      <Button
        outline
        color="danger"
        onClick={() => {
          onClose(true);
        }}
      >
        Sí
      </Button>
      <Button outline onClick={() => onClose(false)}>
        No
      </Button>
    </ModalFooter>
  </Modal>
);

export default ConfirmDelete;
