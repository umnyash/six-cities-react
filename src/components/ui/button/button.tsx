import { PropsWithChildren, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { ButtonType } from './const';

type ButtonProps = PropsWithChildren<{
  type?: ButtonType;
  className?: string;
  href?: string;
  to?: string;
  disabled?: boolean;
  style?: CSSProperties;
  target?: string;
  rel?: string;
  onClick?: () => void;
}>

function Button(props: ButtonProps): JSX.Element {
  const { children, type = ButtonType.Button, className, to, ...otherProps } = props;
  const buttonClassName = clsx('form__submit button', className);

  switch (type) {
    case ButtonType.Button:
    case ButtonType.Submit:
    case ButtonType.Reset:
      return (
        <button
          className={buttonClassName}
          type={type}
          {...otherProps}
        >
          {children}
        </button>
      );
    case ButtonType.Link:
      return (
        <a
          className={buttonClassName}
          {...otherProps}
        >
          {children}
        </a>
      );
    case ButtonType.Route:
      return (
        <Link
          className={buttonClassName}
          to={to as string}
          {...otherProps}
        >
          {children}
        </Link>
      );
  }
}

export default Button;
