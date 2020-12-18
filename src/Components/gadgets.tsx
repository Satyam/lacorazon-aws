import React from 'react';
import { Nav, NavItem, NavLink, TabContent } from 'reactstrap';
import { useLocation, Link } from 'react-router-dom';

export const yearRegExp = /\/y(\d{4})y/;

export const hasYear = (pathname: string) => yearRegExp.test(pathname);
/**
 * Will produce a series of tabs, one for each year, to show the
 * contents of an array by year.  It will respond to clicks on tabs
 * by navigating (using react-router-dom `Link`) to the same base page
 * with the addition, or replacement if found, of `/y9999y` to the path
 * where 9999 is the year on the tab.  It will default to the most
 * recent tab is none is specified in the path.
 *
 * @param props.list Array of objects with a `fecha` property.
 * Array must be sorted by that `fecha` field.
 * If list is undefined or empty, `activeYear` (see below) will be undefined.
 * @param props.children function that will receive an `activeYear` argument
 * corresponding to the year to be displayed. It uses the RenderProps mechanism.
 * It can also be a plain ReactNode which will be simply rendered ignoring the
 * `activeYear` argument.
 *
 * @example
 * <YearTabs list={someArray}>
 *   {(activeYear) => (<table>
 *     <thead> ... </thead>
 *     <tbody>
 *        {someArray
 *           .filter(row => row.fecha === activeYear)
 *           .map(renderRow)
 *        }
 *     </tbody>
 *   </table>)}
 * </YearTabs>
 */
export const YearTabs: React.FC<{
  list?: { fecha: Date }[];
}> = ({ list, children }) => {
  const { pathname } = useLocation();

  const callChildren = (activeYear?: number) => {
    if (children) {
      return (
        <TabContent>
          {typeof children === 'function' ? children(activeYear) : children}
        </TabContent>
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
