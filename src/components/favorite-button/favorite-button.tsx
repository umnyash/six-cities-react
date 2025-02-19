import { AppRoute, AuthorizationStatus } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import { getAuthorizationStatus } from '../../store/user/user.selectors';
import clsx from 'clsx';
import { Link, useLocation, Location } from 'react-router-dom';
import { LocationState } from '../../types/location';

type FavoriteButtonProps = {
  className?: string;
  isActive?: boolean;
}

function FavoriteButton({ className, isActive = false }: FavoriteButtonProps): JSX.Element {
  const buttonClassName = clsx('button', className, isActive && 'offer__bookmark-button--active');
  const isAuthorized = useAppSelector(getAuthorizationStatus) === AuthorizationStatus.Auth;
  const location = useLocation() as Location<LocationState>;

  if (isAuthorized) {
    return (
      <button className={buttonClassName} type="button">
        <svg className="offer__bookmark-icon" width="100%" height="100%">
          <use xlinkHref="#icon-bookmark" />
        </svg>
        <span className="visually-hidden">To bookmarks</span>
      </button>
    );
  }

  return (
    <Link className={buttonClassName} to={AppRoute.Login} state={{ from: location.pathname }}>
      <svg className="offer__bookmark-icon" width="100%" height="100%">
        <use xlinkHref="#icon-bookmark" />
      </svg>
      <span className="visually-hidden">Sign in to bookmark</span>
    </Link>
  );
}

export default FavoriteButton;
