import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selDistribuidores, selDistribuidoresHash } from './selectors';
import { listDistribuidores } from './actions';
import { IDLE, LOADING } from 'Store/constants';

export const useDistribuidores = () => {
  const dispatch = useDispatch();
  const { status, error, distribuidores } = useSelector(selDistribuidores);

  useEffect(() => {
    if (status === IDLE) dispatch(listDistribuidores());
  }, [dispatch, status]);
  return { loading: status === LOADING, error, distribuidores };
};

export const useDistribuidor = (idDistribuidor: ID) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector(selDistribuidores);

  useEffect(() => {
    if (status === IDLE) dispatch(listDistribuidores());
  }, [dispatch, status]);
  const distribuidor = useSelector(selDistribuidoresHash)[idDistribuidor];
  return { loading: status === LOADING, error, distribuidor };
};
