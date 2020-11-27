import React from 'react';

import ErrorBoundary from 'Components/ErrorBoundary';
import WithRole from 'App/users/gadgets';
import { Navigation } from 'Components/Navigation';

import Routes from './Routes';
import Nav from './Nav';
import Providers from './Providers';

const App = () => (
  <Providers>
    <ErrorBoundary>
      <WithRole
        alerta="Aplicación exclusiva para usuarios registrados"
        ofreceLogin
      >
        <Navigation>
          <Nav />
        </Navigation>
        <Routes />
      </WithRole>
    </ErrorBoundary>
  </Providers>
);

export default App;
