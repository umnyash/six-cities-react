import { Link } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';

function UserNavigation(): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  const profileRoute = isAuthorized ? AppRoute.Favorites : AppRoute.Login;

  return (
    <ul className="header__nav-list">
      <li className="header__nav-item user">
        <Link className="header__nav-link header__nav-link--profile" to={profileRoute}>
          <div className="header__avatar-wrapper user__avatar-wrapper" />

          {isAuthorized && (
            <>
              <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
              <span className="header__favorite-count">3</span>
            </>
          )}

          {!isAuthorized && <span className="header__login">Sign in</span>}
        </Link>
      </li>

      {isAuthorized && (
        <li className="header__nav-item">
          <a className="header__nav-link" href="#">
            <span className="header__signout">Sign out</span>
          </a>
        </li>
      )}
    </ul>
  );
}

export default UserNavigation;
