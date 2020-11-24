import React, { DOMAttributes } from 'react';
import { useDistribuidor } from './common';
import { Link } from 'react-router-dom';
import ErrorAlert from 'Components/ErrorAlert';
import icon from 'Components/Modals/loading.gif';

export const ShowDistribuidor: React.FC<
  {
    idDistribuidor: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ idDistribuidor }) => {
  const [distribuidor, loading, error] = useDistribuidor(idDistribuidor);
  if (error)
    return <ErrorAlert error={error}>Cargando distribuidor</ErrorAlert>;
  if (loading) return <img src={icon} alt="loading ..." />;
  if (distribuidor) {
    return (
      <Link to={`/distribuidor/${idDistribuidor}`}>{distribuidor.nombre}</Link>
    );
  }
  return null;
};
