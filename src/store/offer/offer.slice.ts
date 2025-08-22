import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { OfferState } from '../../types/state';
import { CardOffer } from '../../types/offers';
import { fetchOffer, changeFavoriteStatus, logoutUser } from '../async-actions';

const initialState: OfferState = {
  offer: null,
  loadingStatus: RequestStatus.None,
};

const updateFavoriteStatus = (state: OfferState, offer: CardOffer) => {
  if (state.offer?.id === offer.id) {
    state.offer.isFavorite = offer.isFavorite;
  }
};

const resetFavoriteStatus = (state: OfferState) => {
  if (state.offer) {
    state.offer.isFavorite = false;
  }
};

export const offer = createSlice({
  name: NameSpace.Offer,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOffer.pending, (state) => {
        state.offer = null;
        state.loadingStatus = RequestStatus.Pending;
      })
      .addCase(fetchOffer.fulfilled, (state, action) => {
        state.offer = action.payload;
        state.loadingStatus = RequestStatus.Success;
      })
      .addCase(fetchOffer.rejected, (state) => {
        state.loadingStatus = RequestStatus.Error;
      })

      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        updateFavoriteStatus(state, action.payload);
      })

      .addCase(logoutUser.fulfilled, (state) => {
        resetFavoriteStatus(state);
      });
  },
});
