import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, LoadingStatus } from '../../const';
import { FavoritesState } from '../../types/state';
import { CardOffer } from '../../types/offers';
import { fetchFavorites, changeFavoriteStatus } from '../async-actions';
import { removeArrayItem } from '../../util';

const initialState: FavoritesState = {
  favorites: [],
  loadingStatus: LoadingStatus.None,
  changingOffersIds: [],
};

const updateFavorites = (state: FavoritesState, offer: CardOffer) => {
  if (offer.isFavorite) {
    state.favorites.push(offer);
  } else {
    removeArrayItem(state.favorites, { id: offer.id });
  }
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
        removeArrayItem(state.changingOffersIds, action.meta.arg.offerId);
      })
      .addCase(changeFavoriteStatus.rejected, (state, action) => {
        removeArrayItem(state.changingOffersIds, action.meta.arg.offerId);
      });
  },
});
