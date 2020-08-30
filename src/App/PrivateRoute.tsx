import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth0 } from 'Providers/Auth';

export const PrivateRoute: React.FC<{
  path: string;
  permission?: string;
}> & { whyDidYouRender: boolean } = ({
  path,
  permission,
  children,
  ...rest
}) => {
  const { loading, user, loginWithRedirect, can } = useAuth0();

  if (loading) return null;
  if (user) {
    if (permission && !can(permission)) return null;
  } else {
    loginWithRedirect({
      appState: { targetUrl: path },
    });
    return null;
  }
  return (
    <Route path={path} {...rest}>
      {children}
    </Route>
  );
};

export default PrivateRoute;

PrivateRoute.whyDidYouRender = true;
