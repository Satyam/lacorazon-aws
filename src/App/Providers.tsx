import React from 'react';

// Router is, indeed, a context provider
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from '@bit/satyam.components.intl-provider';
import { ModalsProvider } from 'Providers/Modals';

const Providers: React.FC<{}> = ({ children }) => (
  <IntlProvider locale="es-ES">
    <Router>
      <ModalsProvider>{children}</ModalsProvider>
    </Router>
  </IntlProvider>
);

export default Providers;
