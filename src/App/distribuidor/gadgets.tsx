import React, { DOMAttributes } from 'react';
import { db } from 'Firebase';
import { useObjectVal } from 'react-firebase-hooks/database';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import icon from 'Components/Modals/loading.gif';

export const ShowDistribuidor: React.FC<
  {
    idDistribuidor: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ idDistribuidor }) => {
  const [distribuidor, loading, error] = useObjectVal<DistribuidorType>(
    db.ref(`distribuidores/${idDistribuidor}`)
  );
  if (error) return <Alert color="danger">{error}</Alert>;
  if (loading) return <img src={icon} alt="loading ..." />;
  if (distribuidor) {
    return (
      <Link to={`/distribuidor/${idDistribuidor}`}>{distribuidor.nombre}</Link>
    );
  }
  return null;
};
