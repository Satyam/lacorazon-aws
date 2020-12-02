import React from 'react';
import {
  NavLink,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';

const Nav = () => (
  <>
    <NavItem>
      <NavLink tag={Link} to="/gastos">
        Gastos
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/distribuidores">
        Distribuidores
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/ventas">
        Ventas
      </NavLink>
    </NavItem>
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Vendedores
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to="/vendedores">
          Listado
        </DropdownItem>
        <DropdownItem tag={Link} to="/sumario/porVendedor">
          Sumario por vendedor
        </DropdownItem>
        <DropdownItem tag={Link} to="/vendedor/new">
          Crear nuevo
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Sumarios
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to="/sumario/porVendedor">
          Sumario por vendedor
        </DropdownItem>
        <DropdownItem tag={Link} to="/sumario/porDistribuidor">
          Sumario por distribuidor
        </DropdownItem>
        <DropdownItem tag={Link} to="/sumario/caja">
          Sumario de caja
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </>
);

export default Nav;
