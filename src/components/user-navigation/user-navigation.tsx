import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { getAuthorizationStatus, getUser } from '../../store/user/user.selectors';
import { getFavorites } from '../../store/favorites/favorites.selectors';
import { logoutUser } from '../../store/async-actions';

function UserNavigation(): JSX.Element {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const user = useAppSelector(getUser);
  const favorites = useAppSelector(getFavorites);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  const profileRoute = isAuthorized ? AppRoute.Favorites : AppRoute.Login;

  const dispatch = useAppDispatch();

  const handleLogoutButtonClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logoutUser());
  };

  return (
    <ul className="header__nav-list">
      <li className="header__nav-item user">
        <Link className="header__nav-link header__nav-link--profile" to={profileRoute}>
          <div className="header__avatar-wrapper user__avatar-wrapper" />

          {isAuthorized && user && (
            <>
              <span className="header__user-name user__name">{user.email}</span>
              <span className="header__favorite-count">{favorites.length}</span>
            </>
          )}

          {!isAuthorized && <span className="header__login">Sign in</span>}
        </Link>
      </li>

      {isAuthorized && (
        <li className="header__nav-item">
          <a className="header__nav-link" href="#" onClick={handleLogoutButtonClick}>
            <span className="header__signout">Sign out</span>
          </a>
        </li>
      )}
    </ul>
  );
}

export default UserNavigation;
