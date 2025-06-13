import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { NearbyOffersState } from '../../types/state';
import { CardOffer } from '../../types/offers';
import { fetchNearbyOffers, changeFavoriteStatus } from '../async-actions';

const initialState: NearbyOffersState = {
  offers: [],
  loadingStatus: RequestStatus.None,
};

const updateFavoriteStatus = (state: NearbyOffersState, offer: CardOffer) => {
  const foundOffer = state.offers.find((item) => item.id === offer.id);

  if (foundOffer) {
    foundOffer.isFavorite = offer.isFavorite;
  }
};

export const nearbyOffers = createSlice({
  name: NameSpace.NearbyOffers,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchNearbyOffers.pending, (state) => {
        state.offers = [];
        state.loadingStatus = RequestStatus.Pending;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.loadingStatus = RequestStatus.Success;
      })

      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        updateFavoriteStatus(state, action.payload);
      });
  },
});
