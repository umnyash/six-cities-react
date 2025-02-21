import { AppRoute, AuthorizationStatus, FavoriteStatus } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { getAuthorizationStatus } from '../../store/user/user.selectors';
import { changeFavoriteStatus } from '../../store/async-actions';
import clsx from 'clsx';
import { Link, useLocation, Location } from 'react-router-dom';
import { LocationState } from '../../types/location';

type FavoriteButtonProps = {
  offerId: string;
  className?: string;
  isActive?: boolean;
}

function FavoriteButton({ offerId, className, isActive = false }: FavoriteButtonProps): JSX.Element {
  const buttonClassName = clsx('button', className, isActive && 'offer__bookmark-button--active');
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
      <button className={buttonClassName} type="button" onClick={handleButtonClick}>
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
