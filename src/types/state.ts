import { store } from '../store';
import { AuthorizationStatus, SortingOption } from '../const';
import { User } from './user';
import { CityName, Offers } from './offers';
import { Reviews } from './reviews';

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

export type ReviewsState = {
  reviews: Reviews;
}

export type CatalogState = {
  city: CityName;
  sorting: SortingOption;
}

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
