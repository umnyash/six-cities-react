import { createReducer } from '@reduxjs/toolkit';
import { Offers } from '../types/offers';
import { Reviews } from '../types/reviews';

import {
  setOffers,
  setOffersLoadingStatus,
  setNearbyOffers,
  setFavorites,
  setReviews,
} from './actions';


type InitialState = {
  offers: Offers;
  isOffersLoading: boolean;
  nearbyOffers: Offers;
  favorites: Offers;
  reviews: Reviews;
}

const initialState: InitialState = {
  offers: [],
  isOffersLoading: false,
  nearbyOffers: [],
  favorites: [],
  reviews: [],
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setOffersLoadingStatus, (state, action) => {
      state.isOffersLoading = action.payload;
    })
    .addCase(setNearbyOffers, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(setFavorites, (state, action) => {
      state.favorites = action.payload;
    })
    .addCase(setReviews, (state, action) => {
      state.reviews = action.payload;
    });
});

export { reducer };
