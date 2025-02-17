import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, LoadingStatus } from '../../const';
import { OffersState } from '../../types/state';
import { fetchAllOffers, fetchNearbyOffers, fetchOffer } from '../async-actions';

const initialState: OffersState = {
  allOffers: [],
  allOffersLoadingStatus: LoadingStatus.None,
  nearbyOffers: [],
  offer: null,
  offerLoadingStatus: LoadingStatus.None,
};

export const offers = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllOffers.pending, (state) => {
        state.allOffersLoadingStatus = LoadingStatus.Pending;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.allOffers = action.payload;
        state.allOffersLoadingStatus = LoadingStatus.Success;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      })
      .addCase(fetchOffer.pending, (state) => {
        state.offer = null;
        state.offerLoadingStatus = LoadingStatus.Pending;
      })
      .addCase(fetchOffer.fulfilled, (state, action) => {
        state.offer = action.payload;
        state.offerLoadingStatus = LoadingStatus.Success;
      })
      .addCase(fetchOffer.rejected, (state) => {
        state.offerLoadingStatus = LoadingStatus.Error;
      });
  },
});
