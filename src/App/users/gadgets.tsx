import React from 'react';
import firebase from 'firebase';
import { auth, login, logout } from 'Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ErrorAlert from 'Components/ErrorAlert';
import { Alert, Button } from 'reactstrap';
import { useUser } from './common';

export const ADMIN = 'admin';
export const OPERADOR = 'operador';
export const VER = 'ver';

export const WithRole: React.FC<{
  role?: string | string[];
  alerta?: string;
  ofreceLogin?: boolean;
  alt?: React.ReactNode;
}> = ({ children, role, alerta, ofreceLogin, alt }) => {
  const [authUser, loadingAuth, errorAuth]: [
    firebase.User | null,
    boolean,
    any
  ] = useAuthState(auth);
  const [dbUser, loadingDb, errorDb] = useUser(authUser?.uid || '');

  if (loadingAuth || loadingDb) return null;
  if (errorAuth)
    return <ErrorAlert error={errorAuth}>Verificando usuario</ErrorAlert>;
  if (errorDb && errorDb.code !== 'PERMISSION_DENIED') {
    return <ErrorAlert error={errorDb}>Verificando rol usuario</ErrorAlert>;
  }

  if (authUser && !dbUser) {
    logout();
    return (
      <ErrorAlert error={authUser.displayName || ''}>
        Usuario no registrado
      </ErrorAlert>
    );
  }

  const userRole = dbUser?.role;
  if (
    authUser === null ||
    (Array.isArray(role) ? role : [role]).some((r) => r === userRole) === false
  ) {
    return (
      <>
        {alt}
        {alerta && <Alert color="danger">{alerta}</Alert>}
        {ofreceLogin && (
          <Button color="primary" onClick={login}>
            Login
          </Button>
        )}
      </>
    );
  }

  return typeof children === 'function' ? children(authUser, dbUser) : children;
};
