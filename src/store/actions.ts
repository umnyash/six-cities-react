import { createAction } from '@reduxjs/toolkit';
import { Offers, CityName } from '../types/offers';
import { AuthorizationStatus } from '../const';

export const setAuthorizationStatus = createAction<AuthorizationStatus>('user/setAuthorizationStatus');

export const setOffers = createAction<Offers>('offers/set');
export const setOffersLoadingStatus = createAction<boolean>('offers/setLoadingStatus');
export const setNearbyOffers = createAction<Offers>('offers/setNearby');

export const setCity = createAction<CityName>('catalog/setCity');
