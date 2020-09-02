import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selDistribuidores, selDistribuidoresHash } from './selectors';
import { loadDistribuidores } from './actions';
import { IDLE, LOADING } from 'Store/constants';

export const useDistribuidores = () => {
  const dispatch = useDispatch();
  const { status, error, distribuidores } = useSelector(selDistribuidores);

  useEffect(() => {
    if (status === IDLE) dispatch(loadDistribuidores());
  }, [dispatch, status]);
  return { loading: status === LOADING, error, distribuidores };
};

export const useDistribuidor = (idDistribuidor: ID) => {
  const dispatch = useDispatch();
  const { status, error, entities } = useSelector(selDistribuidoresHash);

  useEffect(() => {
    if (status === IDLE) dispatch(loadDistribuidores());
  }, [dispatch, status]);
  return {
    loading: status === LOADING,
    error,
    distribuidor: entities[idDistribuidor],
  };
};
