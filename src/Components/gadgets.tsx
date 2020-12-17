import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { useLocation, Link } from 'react-router-dom';

export const yearRegExp = /\/y(\d{4})y/;

export const hasYear = (pathname: string) => yearRegExp.test(pathname);

export const YearTabs: React.FC<{
  list?: { fecha: Date }[];
}> = ({ list, children }) => {
  const { pathname } = useLocation();

  const callChildren = (activeYear?: number) => {
    if (children) {
      return (
        <>{typeof children === 'function' ? children(activeYear) : children}</>
      );
    }
    return null;
  };
  if (typeof list === 'undefined') return callChildren();
  const l = list.length;
  if (!l) return callChildren();
  const years = [];
  const minYear = list[0].fecha.getFullYear();
  const maxYear = list[l - 1].fecha.getFullYear();
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y);
  }

  let activeYear: number;
  let path: string;
  const yearMatch = yearRegExp.exec(pathname);
  if (yearMatch) {
    activeYear = parseInt(yearMatch[1], 10);
    path = pathname;
  } else {
    activeYear = maxYear || new Date().getFullYear();
    path = `${pathname}/y9999y`;
  }
  if (years)
    return (
      <>
        <Nav tabs>
          {years.map((y) => (
            <NavItem key={y}>
              <NavLink
                tag={Link}
                className={activeYear === y ? 'active' : ''}
                to={path.replace(yearRegExp, `/y${y}y`)}
              >
                {y}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        {callChildren(activeYear)}
      </>
    );
  else return callChildren();
};
