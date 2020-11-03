import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

import config from './firebase.config';

import { useObjectVal } from 'react-firebase-hooks/database';

firebase.initializeApp(config);

export default firebase;

export const db = firebase.database();

export const auth = firebase.auth();
auth.useDeviceLanguage();

export const useVenta = (idVenta: ID) => {
  const [venta, loading, error] = useObjectVal<VentaType>(
    db.ref(`ventas/${idVenta}`)
  );
  return [
    venta
      ? {
          ...venta,
          fecha: new Date(venta?.fecha),
        }
      : venta,
    loading,
    error,
  ];
};
