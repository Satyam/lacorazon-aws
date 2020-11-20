import React, { DOMAttributes } from 'react';
import { useDistribuidor } from './common';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import icon from 'Components/Modals/loading.gif';

export const ShowDistribuidor: React.FC<
  {
    idDistribuidor: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ idDistribuidor }) => {
  const [distribuidor, loading, error] = useDistribuidor(idDistribuidor);
  if (error) return <Alert color="danger">{error}</Alert>;
  if (loading) return <img src={icon} alt="loading ..." />;
  if (distribuidor) {
    return (
      <Link to={`/distribuidor/${idDistribuidor}`}>{distribuidor.nombre}</Link>
    );
  }
  return null;
};
