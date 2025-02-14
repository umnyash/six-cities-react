import { createReducer } from '@reduxjs/toolkit';
import { Offers } from '../types/offers';
import { Reviews } from '../types/reviews';

import {
  setFavorites,
  setReviews,
} from './actions';


type InitialState = {
  favorites: Offers;
  reviews: Reviews;
}

const initialState: InitialState = {
  favorites: [],
  reviews: [],
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setFavorites, (state, action) => {
      state.favorites = action.payload;
    })
    .addCase(setReviews, (state, action) => {
      state.reviews = action.payload;
    });
});

export { reducer };
