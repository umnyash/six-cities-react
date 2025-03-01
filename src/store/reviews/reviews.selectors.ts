import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { NameSpace, REVIEWS_MAX_COUNT } from '../../const';

const sliceName = NameSpace.Reviews;

export const getReviews = (state: State) => state[sliceName].reviews;

export const getLatestReviews = createSelector(
  [getReviews],
  (reviews) => reviews
    .toSorted((a, b) => (a.date < b.date) ? 1 : -1)
    .slice(0, REVIEWS_MAX_COUNT)
);
