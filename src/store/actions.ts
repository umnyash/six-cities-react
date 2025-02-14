import { createAction } from '@reduxjs/toolkit';
import { Offers } from '../types/offers';
import { Reviews } from '../types/reviews';

export const setOffers = createAction<Offers>('offers/set');
export const setOffersLoadingStatus = createAction<boolean>('offers/setLoadingStatus');
export const setNearbyOffers = createAction<Offers>('offers/setNearby');

export const setFavorites = createAction<Offers>('favorites/set');

export const setReviews = createAction<Reviews>('reviews/setReviews');
