import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { ButtonType } from '../../types/button';
import clsx from 'clsx';
import { CSSProperties } from 'react';

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
