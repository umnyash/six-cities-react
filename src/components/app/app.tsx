import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute, AuthorizationStatus } from '../../const';
import { Offers } from '../../types/offers';
import { Reviews } from '../../types/reviews';

import MainPage from '../../pages/main-page';
import OfferPage from '../../pages/offer-page';
import LoginPage from '../../pages/login-page';
import FavoritesPage from '../../pages/favorites-page';
import NotFoundPage from '../../pages/not-found-page';
import PrivateRoute from '../private-route';
import AnonymousRoute from '../anonymous-route';

type AppProps = {
  offers: Offers;
  reviews: Reviews;
}

function App({ offers, reviews }: AppProps): JSX.Element {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={AppRoute.Root}
            element={<MainPage />}
          />
          <Route
            path={AppRoute.Offer}
            element={<OfferPage nearbyOffers={offers} reviews={reviews} />}
          />
          <Route
            path={AppRoute.Login}
            element={
              <AnonymousRoute authorizationStatus={AuthorizationStatus.NoAuth}>
                <LoginPage />
              </AnonymousRoute>
            }
          />
          <Route
            path={AppRoute.Favorites}
            element={
              <PrivateRoute authorizationStatus={AuthorizationStatus.NoAuth}>
                <FavoritesPage favoriteOffers={offers} />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
