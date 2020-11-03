import React from 'react';
import { db } from 'Firebase';
import { useListVals } from 'react-firebase-hooks/database';
import { Alert } from 'reactstrap';
import icon from 'Components/Modals/loading.gif';
import { DropdownField } from 'Components/Form';
import { UseFormMethods } from 'react-hook-form';
const Dropdown: React.FC<{
  idVendedor?: string;

  // for DropdownField
  name: string;
  noOption: boolean;
  label?: string;
  id?: string;
  rows?: number;
  help?: string;
  methods: UseFormMethods<any>;
}> = ({ idVendedor, ...rest }) => {
  const [vendedores, loading, error] = useListVals<VendedorType>(
    db.ref('vendedores')
  );

  if (error) return <Alert color="danger">{error}</Alert>;
  if (loading) return <img src={icon} alt="loading ..." />;
  if (vendedores) {
    return (
      <DropdownField
        {...rest}
        options={vendedores}
        optLabel="nombre"
        optValue="idVendedor"
      />
    );
  }
  return null;
};

export default Dropdown;
