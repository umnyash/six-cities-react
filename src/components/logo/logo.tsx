import { Link, useLocation } from 'react-router-dom';
import { AppRoute } from '../../const';
import { memo } from 'react';

function LogoComponent(): JSX.Element {
  const pathName = useLocation().pathname;
  const isActive = pathName === AppRoute.Root as string;

  if (isActive) {
    return (
      <a className="header__logo-link header__logo-link--active">
        <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
      </a>
    );
  }

  return (
    <Link className="header__logo-link" to={AppRoute.Root}>
      <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
    </Link>
  );
}

const Logo = memo(LogoComponent);

export default Logo;
