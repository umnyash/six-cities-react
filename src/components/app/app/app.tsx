import { Routes, Route } from 'react-router-dom';

import { AppRoute, AuthorizationStatus } from '../../../const';
import { useAppSelector } from '../../../hooks';
import { getAuthorizationStatus } from '../../../store/user/user.selectors';

import Layout from '../../layout/layout';
import LoadingPage from '../../pages/loading-page';
import MainPage from '../../pages/main-page';
import OfferPage from '../../pages/offer-page';
import LoginPage from '../../pages/login-page';
import FavoritesPage from '../../pages/favorites-page';
import NotFoundPage from '../../pages/not-found-page';
import ExclusiveRoute from '../exclusive-route';
import ScrollToTop from '../scrollToTop';

function App(): JSX.Element {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <LoadingPage />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path={AppRoute.Root} element={<Layout />}>
          <Route
            index
            element={<MainPage />}
          />
          <Route
            path={AppRoute.Offer}
            element={<OfferPage />}
          />
          <Route
            path={AppRoute.Login}
            element={
              <ExclusiveRoute onlyFor={AuthorizationStatus.NoAuth}>
                <LoginPage />
              </ExclusiveRoute>
            }
          />
          <Route
            path={AppRoute.Favorites}
            element={
              <ExclusiveRoute onlyFor={AuthorizationStatus.Auth}>
                <FavoritesPage />
              </ExclusiveRoute>
            }
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
