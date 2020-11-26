import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import { FaUser } from 'react-icons/fa';
import firebase from 'firebase';
import { login, logout } from 'Firebase';
import { useIntl } from 'Providers/Intl';
import { WithRole, ADMIN, OPERADOR, VER } from 'App/users/gadgets';

import styles from './styles.module.css';

export const Navigation: React.FC = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const { locale, setLocale, locales } = useIntl();

  function toggle() {
    setOpen(!isOpen);
  }

  return (
    <div>
      <Navbar expand="md" light className={styles.navbar}>
        <NavbarBrand href="/" className={styles.navbrand}>
          <img
            src={process.env.PUBLIC_URL + '/lacorazon.png'}
            alt="La Corazón"
          />
          La Corazón
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <WithRole role={[ADMIN, OPERADOR]}>{children}</WithRole>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {locale}
              </DropdownToggle>
              <DropdownMenu right>
                {locales.map((l) => (
                  <DropdownItem
                    key={l}
                    active={l === locale}
                    onClick={() => setLocale(l)}
                  >
                    {l}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
            <WithRole
              role={[ADMIN, OPERADOR, VER]}
              alt={
                <>
                  <FaUser />
                  <NavItem>
                    <NavLink onClick={login}>Login</NavLink>
                  </NavItem>
                </>
              }
            >
              {(user: firebase.User) => (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret className={styles.user}>
                    <img src={user?.photoURL || ''} alt="User" />
                    {user?.displayName}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem tag={Link} to="/profile">
                      Profile
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </WithRole>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
