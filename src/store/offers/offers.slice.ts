import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, LoadingStatus } from '../../const';
import { OffersState } from '../../types/state';
import { CardOffer } from '../../types/offers';
import { fetchAllOffers, fetchNearbyOffers, fetchOffer, changeFavoriteStatus } from '../async-actions';

const initialState: OffersState = {
  allOffers: [],
  allOffersLoadingStatus: LoadingStatus.None,
  nearbyOffers: [],
  offer: null,
  offerLoadingStatus: LoadingStatus.None,
};

const updateFavoriteStatus = (state: OffersState, offer: CardOffer) => {
  if (state.allOffersLoadingStatus === LoadingStatus.Success) {
    const foundOffer = state.allOffers.find((item) => item.id === offer.id);

    if (foundOffer) {
      foundOffer.isFavorite = offer.isFavorite;
    } else {
      throw new Error(`Offer with id ${offer.id} not found in all offers.`);
    }
  }

  const nearbyFoundOffer = state.nearbyOffers.find((item) => item.id === offer.id);

  if (nearbyFoundOffer) {
    nearbyFoundOffer.isFavorite = offer.isFavorite;
  }

  if (state.offer?.id === offer.id) {
    state.offer.isFavorite = offer.isFavorite;
  }
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
      .addCase(fetchAllOffers.rejected, (state) => {
        state.allOffersLoadingStatus = LoadingStatus.Error;
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
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        updateFavoriteStatus(state, action.payload);
      });
  },
});
