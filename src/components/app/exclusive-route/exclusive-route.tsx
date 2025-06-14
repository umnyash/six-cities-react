import { Navigate, useLocation, Location } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../../const';
import { LocationState } from '../../../types/location';
import useAppSelector from '../../../hooks/use-app-selector';
import { getAuthorizationStatus } from '../../../store/user/user.selectors';

type ExclusiveRouteProps = {
  children: JSX.Element;
  onlyFor: AuthorizationStatus;
}

function ExclusiveRoute({ onlyFor, children }: ExclusiveRouteProps): JSX.Element {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const location = useLocation() as Location<LocationState>;

  if (authorizationStatus !== onlyFor) {

    switch (onlyFor) {
      case AuthorizationStatus.Auth:
        return <Navigate to={AppRoute.Login} state={{ from: location.pathname }} />;

      case AuthorizationStatus.NoAuth:
        return <Navigate to={location.state?.from || AppRoute.Root} />;
    }
  }

  return children;
}

export default ExclusiveRoute;
