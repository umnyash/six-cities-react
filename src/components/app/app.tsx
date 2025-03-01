import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import { getAuthorizationStatus } from '../../store/user/user.selectors';
import { AuthorizationStatus } from '../../const';

import Layout from '../layout';
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
    return (
      <HelmetProvider>
        <LoadingPage />
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
