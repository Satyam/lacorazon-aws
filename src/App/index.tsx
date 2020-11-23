import React from 'react';

import ErrorBoundary from 'Components/ErrorBoundary';

import { Navigation } from 'Components/Navigation';

import Routes from './Routes';
import Nav from './Nav';
import Providers from './Providers';

const App = () => (
  <Providers>
    <ErrorBoundary>
      <Navigation>
        <Nav />
      </Navigation>
      <Routes />
    </ErrorBoundary>
  </Providers>
);

export default App;
