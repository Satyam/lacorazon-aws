import React from 'react';

import ErrorBoundary from 'Components/ErrorBoundary';

import { Navigation } from 'Components/Navigation';

import Routes from './Routes';
import Providers from './Providers';

const App = () => (
  <Providers>
    <ErrorBoundary>
      <Navigation />
      <Routes />
    </ErrorBoundary>
  </Providers>
);

export default App;
