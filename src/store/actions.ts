import { createAction } from '@reduxjs/toolkit';
import { Offers } from '../types/offers';
import { Reviews } from '../types/reviews';

export const setFavorites = createAction<Offers>('favorites/set');

export const setReviews = createAction<Reviews>('reviews/setReviews');
