import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import Users from 'Components/user/ListUsers';
// import EditUser from 'Components/user/EditUser';
// import ShowUser from 'Components/user/ShowUser';
import Distribuidores from 'Components/distribuidor/ListDistribuidores';
import EditDistribuidor from 'Components/distribuidor/EditDistribuidor';
import ShowDistribuidor from 'Components/distribuidor/ShowDistribuidor';
import ListVentas from 'Components/ventas/ListVentas';
import EditVenta from 'Components/ventas/EditVenta';
import ShowVenta from 'Components/ventas/ShowVenta';
import SumarioVendedores from 'Components/sumarios/PorVendedor';
// import Profile from 'Components/Profile';

// import PrivateRoute from './PrivateRoute';
/* Update:
https://reacttraining.com/blog/react-router-v5-1/#staying-ahead-of-the-curve
*/

const Routes = () => (
  <>
    {/* <Route path="/users">
      <Users />
    </Route>
    <Switch>
      <Route path="/user/new">
        <EditUser />
      </Route>
      <Route path="/user/edit/:id">
        <EditUser />
      </Route>
      <Route path="/user/:id">
        <ShowUser />
      </Route>
    </Switch> */}
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
    <Route path="/ventas">
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
    {/* <PrivateRoute path="/profile">
      <Profile />
    </PrivateRoute> */}
  </>
);

export default Routes;
