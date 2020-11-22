import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import Users from 'Components/user/ListUsers';
// import EditUser from 'Components/user/EditUser';
// import ShowUser from 'Components/user/ShowUser';
import ListGastos from 'App/Gastos/ListGastos';
import ShowGasto from 'App/Gastos/ShowGasto';
import EditGasto from 'App/Gastos/EditGasto';
import Distribuidores from 'App/distribuidor/ListDistribuidores';
import EditDistribuidor from 'App/distribuidor/EditDistribuidor';
import ShowDistribuidor from 'App/distribuidor/ShowDistribuidor';
import ListVentas from 'App/ventas/ListVentas';
import EditVenta from 'App/ventas/EditVenta';
import ShowVenta from 'App/ventas/ShowVenta';
import SumarioVendedores from 'App/sumarios/PorVendedor';
import SumarioDistribuidores from 'App/sumarios/PorDistribuidor';
import SumarioCaja from 'App/sumarios/Caja';
// import Profile from 'Components/Profile';

// import PrivateRoute from './PrivateRoute';
/* Update:
https://reacttraining.com/blog/react-router-v5-1/#staying-ahead-of-the-curve
*/

const Routes = () => (
  <>
    <Route path="/gastos/:year?">
      <ListGastos />
    </Route>
    <Switch>
      <Route path="/gasto/new/:categoria">
        <EditGasto />
      </Route>
      <Route path="/gasto/edit/:idGasto">
        <EditGasto />
      </Route>
      <Route path="/gasto/:idGasto">
        <ShowGasto />
      </Route>
    </Switch>
    <Route path="/distribuidores">
      <Distribuidores />
    </Route>
    <Switch>
      <Route path="/distribuidor/new">
        <EditDistribuidor />
      </Route>
      <Route path="/distribuidor/edit/:idDistribuidor">
        <EditDistribuidor />
      </Route>
      <Route path="/distribuidor/:idDistribuidor">
        <ShowDistribuidor />
      </Route>
    </Switch>
    <Route path="/ventas/:year?">
      <ListVentas />
    </Route>
    <Switch>
      <Route path="/venta/new">
        <EditVenta />
      </Route>
      <Route path="/venta/edit/:idVenta">
        <EditVenta />
      </Route>
      <Route path="/venta/:idVenta">
        <ShowVenta />
      </Route>
    </Switch>
    <Route path="/sumario/porVendedor">
      <SumarioVendedores />
    </Route>
    <Route path="/sumario/porDistribuidor">
      <SumarioDistribuidores />
    </Route>
    <Route path="/sumario/caja/:year?">
      <SumarioCaja />
    </Route>

    {/* <PrivateRoute path="/profile">
      <Profile />
    </PrivateRoute> */}
  </>
);

export default Routes;
