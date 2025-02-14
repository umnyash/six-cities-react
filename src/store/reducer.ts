import { createReducer } from '@reduxjs/toolkit';
import { Reviews } from '../types/reviews';

import {
  setReviews,
} from './actions';


type InitialState = {
  reviews: Reviews;
}

const initialState: InitialState = {
  reviews: [],
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setReviews, (state, action) => {
      state.reviews = action.payload;
    });
});

export { reducer };
