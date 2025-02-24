import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, LoadingStatus } from '../../const';
import { FavoritesState } from '../../types/state';
import { Offers, CardOffer } from '../../types/offers';
import { fetchFavorites, changeFavoriteStatus } from '../async-actions';

const initialState: FavoritesState = {
  favorites: [],
  loadingStatus: LoadingStatus.None,
  changingOffersIds: [],
};

const removeFavorite = (favorites: Offers, offerId: string) => {
  const removedOfferIndex = favorites.findIndex((item) => item.id === offerId);

  if (removedOfferIndex === -1) {
    throw new Error(`Offer with id ${offerId} not found in favorites.`);
  }

  favorites.splice(removedOfferIndex, 1);
};

const updateFavorites = (state: FavoritesState, offer: CardOffer) => {
  if (offer.isFavorite) {
    state.favorites.push(offer);
  } else {
    removeFavorite(state.favorites, offer.id);
  }
};

const removeChangingOfferId = (state: FavoritesState, offerId: string) => {
  state.changingOffersIds = state.changingOffersIds.filter((item) => item !== offerId);
};

export const favorites = createSlice({
  name: NameSpace.Favorites,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loadingStatus = LoadingStatus.Pending;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.loadingStatus = LoadingStatus.Success;
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.loadingStatus = LoadingStatus.Error;
      })
      .addCase(changeFavoriteStatus.pending, (state, action) => {
        state.changingOffersIds.push(action.meta.arg.offerId);
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        updateFavorites(state, action.payload);
        removeChangingOfferId(state, action.meta.arg.offerId);
      })
      .addCase(changeFavoriteStatus.rejected, (state, action) => {
        removeChangingOfferId(state, action.meta.arg.offerId);
      });
  },
});
