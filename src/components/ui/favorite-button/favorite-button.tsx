import { Link, useLocation, Location } from 'react-router-dom';
import clsx from 'clsx';

import { AppRoute, AuthorizationStatus, FavoriteStatus } from '../../../const';
import { LocationState } from '../../../types/location';
import useAppSelector from '../../../hooks/use-app-selector';
import useAppDispatch from '../../../hooks/use-app-dispatch';
import { changeFavoriteStatus } from '../../../store/async-actions';
import { getAuthorizationStatus } from '../../../store/user/user.selectors';
import { getChangingOffersIds } from '../../../store/favorites/favorites.selectors';

import style from './favorite-button.module.css';

type FavoriteButtonProps = {
  offerId: string;
  className?: string;
  isActive?: boolean;
}

function FavoriteButton({ offerId, className, isActive = false }: FavoriteButtonProps): JSX.Element {
  const isPending = useAppSelector(getChangingOffersIds).includes(offerId);

  const buttonClassName = clsx(
    'button',
    className,
    isPending && style.pending,
    isActive && 'offer__bookmark-button--active'
  );

  const isAuthorized = useAppSelector(getAuthorizationStatus) === AuthorizationStatus.Auth;
  const location = useLocation() as Location<LocationState>;
  const dispatch = useAppDispatch();

  const handleButtonClick = () => {
    dispatch(changeFavoriteStatus({
      offerId,
      status: (isActive) ? FavoriteStatus.Off : FavoriteStatus.On
    }));
  };

  if (isAuthorized) {
    return (
      <button
        className={buttonClassName}
        type="button"
        disabled={isPending}
        aria-pressed={isActive}
        onClick={handleButtonClick}
      >
        <svg className="offer__bookmark-icon" width="100%" height="100%">
          <use xlinkHref="#icon-bookmark" />
        </svg>
        <span className="visually-hidden">{isActive ? 'Bookmarked' : 'Add to bookmarks'}</span>
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
