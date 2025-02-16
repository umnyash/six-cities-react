import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { OffersState } from '../../types/state';
import { fetchAllOffers, fetchNearbyOffers } from '../async-actions';

const initialState: OffersState = {
  allOffers: [],
  isAllOffersLoading: false,
  nearbyOffers: [],
};

export const offers = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllOffers.pending, (state) => {
        state.isAllOffersLoading = true;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.allOffers = action.payload;
        state.isAllOffersLoading = false;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      });
  },
});
