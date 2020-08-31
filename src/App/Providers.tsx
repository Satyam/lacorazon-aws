import React from 'react';

// Router is, indeed, a context provider
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'Providers/Intl';
import { ModalsProvider } from 'Providers/Modals';
import { Provider as ReduxProvider } from 'react-redux';
import store from 'Store';

const Providers: React.FC<{}> = ({ children }) => (
  <IntlProvider locale="es-ES">
    <Router>
      <ReduxProvider store={store}>
        <ModalsProvider>{children}</ModalsProvider>
      </ReduxProvider>
    </Router>
  </IntlProvider>
);

export default Providers;
