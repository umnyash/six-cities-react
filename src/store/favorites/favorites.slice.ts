import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { FavoritesState } from '../../types/state';
import { Offers, CardOffer } from '../../types/offers';
import { fetchFavorites, changeFavoriteStatus } from '../async-actions';

const initialState: FavoritesState = {
  favorites: []
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

export const favorites = createSlice({
  name: NameSpace.Favorites,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        updateFavorites(state, action.payload);
      });
  },
});
