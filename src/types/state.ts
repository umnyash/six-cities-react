import { store } from '../store';
import { AuthorizationStatus } from '../const';
import { User } from './user';
import { CityName, Offers } from './offers';

export type UserState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
}

export type OffersState = {
  offers: Offers;
  isOffersLoading: boolean;
  nearbyOffers: Offers;
}

export type FavoritesState = {
  favorites: Offers;
}

export type CatalogState = {
  city: CityName;
}

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
