import { store } from '../store';
import { RequestStatus, AuthorizationStatus, SortingOption } from '../const';
import { User } from './user';
import { CityName, Offers, PageOffer } from './offers';
import { Reviews } from './reviews';

export type UserState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
}

export type OffersState = {
  allOffers: Offers;
  allOffersLoadingStatus: RequestStatus;
  city: CityName;
  sorting: SortingOption;
  nearbyOffers: Offers;
  nearbyOffersLoadingStatus: RequestStatus;
  offer: PageOffer | null;
  offerLoadingStatus: RequestStatus;
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

export type CatalogState = {
  city: CityName;
  sorting: SortingOption;
}

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
