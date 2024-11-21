import { NavLink } from 'react-router-dom';
import { AppRoute } from '../../const';

function Logo(): JSX.Element {
  const getClassName = ({ isActive }: { isActive: boolean }) => isActive
    ? 'header__logo-link header__logo-link--active'
    : 'header__logo-link';

  return (
    <NavLink className={getClassName} to={AppRoute.Root}>
      <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
    </NavLink>
  );
}

export default Logo;
