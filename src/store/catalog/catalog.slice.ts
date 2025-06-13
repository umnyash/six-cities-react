import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus, CITIES, SortingOption } from '../../const';
import { CatalogState } from '../../types/state';
import { CardOffer, CityName } from '../../types/offers';
import { fetchAllOffers, changeFavoriteStatus } from '../async-actions';

const initialState: CatalogState = {
  offers: [],
  loadingStatus: RequestStatus.None,
  city: CITIES[0],
  sorting: SortingOption.Default,
};

const updateFavoriteStatus = (state: CatalogState, offer: CardOffer) => {
  if (state.loadingStatus === RequestStatus.Success) {
    const foundOffer = state.offers.find((item) => item.id === offer.id);

    if (foundOffer) {
      foundOffer.isFavorite = offer.isFavorite;
    } else {
      throw new Error(`Offer with id ${offer.id} not found in catalog.`);
    }
  }
};

export const catalog = createSlice({
  name: NameSpace.Catalog,
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<CityName>) => {
      state.city = action.payload;
    },
    setSorting: (state, action: PayloadAction<SortingOption>) => {
      state.sorting = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllOffers.pending, (state) => {
        state.loadingStatus = RequestStatus.Pending;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.loadingStatus = RequestStatus.Success;
      })
      .addCase(fetchAllOffers.rejected, (state) => {
        state.loadingStatus = RequestStatus.Error;
      })

      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        updateFavoriteStatus(state, action.payload);
      });
  },
});

export const { setCity, setSorting } = catalog.actions;
