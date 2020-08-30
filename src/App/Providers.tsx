import React from 'react';

// Router is, indeed, a context provider
import { BrowserRouter as Router } from 'react-router-dom';
import { GqlProvider } from 'Providers/Apollo';
import { Auth0Provider } from 'Providers/Auth';
import { IntlProvider } from 'Providers/Intl';
import { ModalsProvider } from 'Providers/Modals';

const Providers: React.FC<{}> = ({ children }) => (
  <IntlProvider locale="es-ES">
    <Router>
      {/* Auth0Provider requires Router to be available 
          so it can navigate on being redirected from login and logout */}
      <Auth0Provider
        domain={'dev-5ev0q6ua.eu.auth0.com'}
        client_id={'DBbfOnjfs74eUf3wVFqzHbWeCwkcYkdt'}
        redirect_uri={window.location.origin}
        audience="https://lacorazon.es"
      >
        {/* GqlProvider requires Auth0Provider context to exists,
            so it can get the authorization token for the user.
            It also depends on Auth0Provider to refresh the tree
            when the user logs in or out, there is no point in
            doing it twice */}
        <GqlProvider>
          <ModalsProvider>{children}</ModalsProvider>
        </GqlProvider>
      </Auth0Provider>
    </Router>
  </IntlProvider>
);

export default Providers;
