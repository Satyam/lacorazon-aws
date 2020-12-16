import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { useLocation, Link } from 'react-router-dom';

import { yearRegExp } from './utils';
export const YearTabs: React.FC<{
  years?: number[];
  activeYear?: number;
}> = ({ years, activeYear }) => {
  const { pathname } = useLocation();
  const path = yearRegExp.test(pathname) ? pathname : `${pathname}/y9999y`;
  if (years && activeYear)
    return (
      <Nav tabs>
        {years.map((y) => (
          <NavItem key={y}>
            <NavLink
              tag={Link}
              className={activeYear === y ? 'active' : ''}
              to={path.replace(yearRegExp, `y${y}y`)}
            >
              {y}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    );
  else return null;
};
