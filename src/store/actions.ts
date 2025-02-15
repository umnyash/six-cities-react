import { createAction } from '@reduxjs/toolkit';
import { UserState } from '../types/user';
import { Offers, CityName } from '../types/offers';
import { Reviews } from '../types/reviews';
import { AuthorizationStatus } from '../const';

export const setAuthorizationStatus = createAction<AuthorizationStatus>('user/setAuthorizationStatus');
export const setUser = createAction<UserState>('user/set');

export const setOffers = createAction<Offers>('offers/set');
export const setOffersLoadingStatus = createAction<boolean>('offers/setLoadingStatus');
export const setNearbyOffers = createAction<Offers>('offers/setNearby');

export const setFavorites = createAction<Offers>('favorites/set');

export const setReviews = createAction<Reviews>('reviews/setReviews');

export const setCity = createAction<CityName>('catalog/setCity');
