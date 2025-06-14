import { MouseEvent } from 'react';
import { Link, useLocation, Location } from 'react-router-dom';

import { AppRoute, AuthorizationStatus } from '../../../const';
import { LocationState } from '../../../types/location';
import useAppSelector from '../../../hooks/use-app-selector';
import useAppDispatch from '../../../hooks/use-app-dispatch';
import { logoutUser } from '../../../store/async-actions';
import { getAuthorizationStatus, getUser } from '../../../store/user/user.selectors';
import { getFavorites } from '../../../store/favorites/favorites.selectors';

function UserNavigation(): JSX.Element {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const user = useAppSelector(getUser);
  const favorites = useAppSelector(getFavorites);
  const location = useLocation() as Location<LocationState>;

  const dispatch = useAppDispatch();

  const handleLogoutButtonClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logoutUser());
  };

  return (
    <ul className="header__nav-list">
      <li className="header__nav-item user">
        {authorizationStatus === AuthorizationStatus.Auth && user && (
          <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
            <div className="header__avatar-wrapper user__avatar-wrapper" />
            <span className="header__user-name user__name">{user.email}</span>
            <span className="header__favorite-count">{favorites.length}</span>
          </Link>
        )}

        {authorizationStatus === AuthorizationStatus.NoAuth && (
          <Link
            className="header__nav-link header__nav-link--profile"
            to={AppRoute.Login}
            state={{ from: location.pathname }}
          >
            <div className="header__avatar-wrapper user__avatar-wrapper" />
            <span className="header__login">Sign in</span>
          </Link>
        )}
      </li>

      {authorizationStatus === AuthorizationStatus.Auth && (
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
