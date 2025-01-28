import { createReducer } from '@reduxjs/toolkit';
import { UserState } from '../types/user';
import { Offers, CityName } from '../types/offers';
import { CITIES, AuthorizationStatus } from '../const';

import {
  setAuthorizationStatus,
  setUser,
  setOffers,
  setOffersLoadingStatus,
  setNearbyOffers,
  setCity
} from './actions';


type InitialState = {
  authorizationStatus: AuthorizationStatus;
  user: UserState | null;
  offers: Offers;
  isOffersLoading: boolean;
  nearbyOffers: Offers;
  city: CityName;
}

const initialState: InitialState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  offers: [],
  isOffersLoading: false,
  nearbyOffers: [],
  city: CITIES[0],
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUser, (state, action) => {
      state.user = action.payload;
    })
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setOffersLoadingStatus, (state, action) => {
      state.isOffersLoading = action.payload;
    })
    .addCase(setNearbyOffers, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(setCity, (state, action) => {
      state.city = action.payload;
    });
});

export { reducer };
