import React, { useState, useEffect } from 'react';
import { auth, login, logout } from 'Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ErrorAlert from 'Components/ErrorAlert';
import { Alert, Button } from 'reactstrap';

export const ADMIN = 'admin';
export const OPERADOR = 'operador';
export const VER = 'ver';

export const WithRole: React.FC<{
  role?: string | string[];
  alerta?: string;
  ofreceLogin?: boolean;
  alt?: React.ReactNode;
}> = ({ children, role, alerta, ofreceLogin, alt }) => {
  const [authUser, loading, error] = useAuthState(auth);
  const [claims, setClaims] = useState<
    Record<string, any> | undefined | null
  >();

  useEffect(() => {
    if (authUser) {
      authUser.getIdTokenResult().then((data) => {
        setClaims(data.claims.aud === 'lacorazon-d66fd' ? data.claims : null);
      });
    }
  }, [authUser]);

  if (loading) return null;
  if (error && error.code !== 'PERMISSION_DENIED') {
    return <ErrorAlert error={error}>Verificando rol usuario</ErrorAlert>;
  }

  const noGo = () => (
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

  if (!authUser) {
    return noGo();
  }

  if (claims === null) {
    logout();
    return (
      <ErrorAlert error={authUser?.displayName || ''}>
        Usuario no registrado
      </ErrorAlert>
    );
  }

  if (role) {
    if (
      claims &&
      (Array.isArray(role) ? role : [role]).some((r) => claims[r]) === false
    )
      return noGo();
  }
  return typeof children === 'function' ? children(authUser, claims) : children;
};

export default WithRole;
