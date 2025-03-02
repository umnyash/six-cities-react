import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus, CITIES, SortingOption } from '../../const';
import { OffersState } from '../../types/state';
import { CardOffer, CityName } from '../../types/offers';
import { fetchAllOffers, fetchNearbyOffers, fetchOffer, changeFavoriteStatus } from '../async-actions';

const initialState: OffersState = {
  allOffers: [],
  allOffersLoadingStatus: RequestStatus.None,
  city: CITIES[0],
  sorting: SortingOption.Default,
  nearbyOffers: [],
  nearbyOffersLoadingStatus: RequestStatus.None,
  offer: null,
  offerLoadingStatus: RequestStatus.None,
};

const updateFavoriteStatus = (state: OffersState, offer: CardOffer) => {
  if (state.allOffersLoadingStatus === RequestStatus.Success) {
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
        state.allOffersLoadingStatus = RequestStatus.Pending;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.allOffers = action.payload;
        state.allOffersLoadingStatus = RequestStatus.Success;
      })
      .addCase(fetchAllOffers.rejected, (state) => {
        state.allOffersLoadingStatus = RequestStatus.Error;
      })

      .addCase(fetchNearbyOffers.pending, (state) => {
        state.nearbyOffers = [];
        state.nearbyOffersLoadingStatus = RequestStatus.Pending;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
        state.nearbyOffersLoadingStatus = RequestStatus.Success;
      })

      .addCase(fetchOffer.pending, (state) => {
        state.offer = null;
        state.offerLoadingStatus = RequestStatus.Pending;
      })
      .addCase(fetchOffer.fulfilled, (state, action) => {
        state.offer = action.payload;
        state.offerLoadingStatus = RequestStatus.Success;
      })
      .addCase(fetchOffer.rejected, (state) => {
        state.offerLoadingStatus = RequestStatus.Error;
      })

      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        updateFavoriteStatus(state, action.payload);
      });
  },
});

export const { setCity, setSorting } = offers.actions;
