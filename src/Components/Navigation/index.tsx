import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import { FaUser } from 'react-icons/fa';
import { auth, login, logout } from 'Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loading } from 'Components/Modals';
import { Alert } from 'reactstrap';
import { useIntl } from 'Providers/Intl';

import styles from './styles.module.css';

export const Navigation: React.FC = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const { locale, setLocale, locales } = useIntl();
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <Loading>Cargando datos usuario</Loading>;
  if (error) {
    return <Alert>Error: {error}</Alert>;
  }
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
            {children}

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
            <UncontrolledDropdown nav inNavbar>
              {user ? (
                <>
                  <DropdownToggle nav caret className={styles.user}>
                    <img src={user.photoURL} alt="User" />
                    {user.displayName}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem tag={Link} to="/profile">
                      Profile
                    </DropdownItem>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <DropdownToggle nav caret className={styles.user}>
                    <FaUser />
                    guest
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => login()}>Login</DropdownItem>
                  </DropdownMenu>
                </>
              )}
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
