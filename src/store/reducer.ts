import { createReducer } from '@reduxjs/toolkit';
import { setAuthorizationStatus, setOffers, setOffersLoadingStatus, setCity } from './actions';
import { Offers, CityName } from '../types/offers';
import { CITIES, AuthorizationStatus } from '../const';

type InitialState = {
  authorizationStatus: AuthorizationStatus;
  offers: Offers;
  isOffersLoading: boolean;
  city: CityName;
}

const initialState: InitialState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  offers: [],
  isOffersLoading: false,
  city: CITIES[0],
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setOffersLoadingStatus, (state, action) => {
      state.isOffersLoading = action.payload;
    })
    .addCase(setCity, (state, action) => {
      state.city = action.payload;
    });
});

export { reducer };
