import { createAction } from '@reduxjs/toolkit';
import { Reviews } from '../types/reviews';

export const setReviews = createAction<Reviews>('reviews/setReviews');
