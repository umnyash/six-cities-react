import { createReducer } from '@reduxjs/toolkit';
import { setOffers, setCity } from './actions';
import { Offers, CityName } from '../types/offers';
import { CITIES } from '../const';

type InitialState = {
  offers: Offers;
  city: CityName;
}

const initialState: InitialState = {
  offers: [],
  city: CITIES[0],
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setCity, (state, action) => {
      state.city = action.payload;
    });
});

export { reducer };
