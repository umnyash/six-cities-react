import { store } from '../store';
import { RequestStatus, AuthorizationStatus, SortingOption } from '../const';
import { User } from './user';
import { CityName, Offers, PageOffer } from './offers';
import { Reviews } from './reviews';

export type UserState = {
  user: User | null;
  authorizationStatus: AuthorizationStatus;
  loggingInStatus: RequestStatus;
}

export type CatalogState = {
  offers: Offers;
  loadingStatus: RequestStatus;
  city: CityName;
  sorting: SortingOption;
}

export type NearbyOffersState = {
  offers: Offers;
  loadingStatus: RequestStatus;
}

export type OfferState = {
  offer: PageOffer | null;
  loadingStatus: RequestStatus;
}

export type FavoritesState = {
  favorites: Offers;
  loadingStatus: RequestStatus;
  changingOffersIds: string[];
}

export type ReviewsState = {
  reviews: Reviews;
  reviewSubmittingStatus: RequestStatus;
}

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
