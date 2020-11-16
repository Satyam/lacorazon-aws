import React from 'react';
import { GASTO, REINTEGRO, PAGO_IVA, COMISION } from './common';

import { ShowVendedor } from 'App/vendedores/gadgets';

export const ShowCategoria: React.FC<{
  categoria: string;
  idVendedor?: string;
}> = ({ categoria, idVendedor }) => {
  switch (categoria) {
    case GASTO:
      return <span>Gasto</span>;
    case PAGO_IVA:
      return <span>Pago IVA</span>;
    case REINTEGRO:
      return <span>Reintegro</span>;
    case COMISION:
      return (
        <span>
          Comisión {idVendedor ? <ShowVendedor idVendedor={idVendedor} /> : ''}
        </span>
      );
    default:
      return null;
  }
};
