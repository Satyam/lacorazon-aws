import React, { useState, cloneElement, Children } from 'react';
import invariant from 'invariant';
import { Button } from 'reactstrap';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import classNames from 'classnames';

type AccordionPanelProps = {
  label: string;
  name: string;
  open?: boolean;
};

export const AccordionPanel: React.FC<AccordionPanelProps> = ({
  label,
  name,
  open,
  children,
}) => (
    <div className="card">
      <div className="card-header p-0">
        <Button color="secondary" size="sm" block data-name={name}>
          {label}
          {open ? (
            <FaCaretUp className="float-right" />
          ) : (
              <FaCaretDown className="float-right" />
            )}
        </Button>
      </div>

      <div className={classNames('collapse', { show: open })}>
        {open && <div className="card-body p-1">{children} </div>}
      </div>
    </div>
  );

type AccordionProps = {
  mutuallyExclusive?: boolean;
  allClose?: boolean;
  initiallyOpen?: string[];
  // children: React.ReactElement<AccordionPanelProps>[];
};

export const Accordion: React.FC<AccordionProps> = ({
  mutuallyExclusive = true,
  allClose = true,
  initiallyOpen = [],
  children,
}) => {
  const [nowOpen, setOpen] = useState<string[]>(initiallyOpen);

  const elements = Children.toArray(children);

  invariant(elements.length > 1, 'Accordion should have multiple panels');

  if (mutuallyExclusive && nowOpen.length > 1) {
    setOpen([nowOpen[0]]);
  }

  if (React.isValidElement<AccordionPanelProps>(elements[0])) {
    if (!allClose && nowOpen.length === 0) {
      setOpen([elements[0].props.name]);
    }
  }

  const onClick: React.MouseEventHandler<HTMLDivElement> = ev => {
    if (ev.target instanceof HTMLButtonElement && 'name' in ev.target.dataset) {
      ev.stopPropagation();
      const name = String(ev.target.dataset.name);
      if (nowOpen.includes(name)) {
        if (allClose || nowOpen.length > 1) {
          setOpen(nowOpen.filter(k => k !== name));
        }
      } else {
        if (mutuallyExclusive) {
          setOpen([name]);
        } else {
          setOpen(nowOpen.concat(name));
        }
      }
    }
  };
  return (
    <div className="accordion" onClick={onClick}>
      {elements.map(child => {
        if (React.isValidElement<AccordionPanelProps>(child)) {
          const name = child.props.name;
          return cloneElement(child, { key: name, open: nowOpen.includes(name) });
        }
        return child;
      })}
    </div>
  );
};
