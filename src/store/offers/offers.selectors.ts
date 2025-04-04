import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { NameSpace, SortingOption } from '../../const';
import { groupBy } from '../../util';

const sliceName = NameSpace.Offers;
type StateSlice = Pick<State, NameSpace.Offers>;

const getAllOffers = (state: StateSlice) => state[sliceName].allOffers;

export const getAllOffersLoadingStatus = (state: StateSlice) => state[sliceName].allOffersLoadingStatus;
export const getCity = (state: StateSlice) => state[sliceName].city;
export const getSorting = (state: StateSlice) => state[sliceName].sorting;

const getAllOffersGroupedByCity = createSelector(
  [getAllOffers],
  (offers) => groupBy(offers, (offer) => offer.city.name)
);

export const getAllOffersByCity = createSelector(
  [getAllOffersGroupedByCity, getCity],
  (groupedOffers, city) => groupedOffers[city] ?? []
);

export const getSortedAllOffersByCity = createSelector(
  [getAllOffersByCity, getSorting],

  (offersByCity, sortingOption) => {
    switch (sortingOption) {
      case SortingOption.PriceAsc:
        return offersByCity.toSorted((a, b) => a.price - b.price);
      case SortingOption.PriceDesc:
        return offersByCity.toSorted((a, b) => b.price - a.price);
      case SortingOption.RatingDesc:
        return offersByCity.toSorted((a, b) => b.rating - a.rating);
      default:
        return offersByCity;
    }
  }
);

export const getNearbyOffers = (state: StateSlice) => state[sliceName].nearbyOffers;
export const getNearbyOffersLoadingStatus = (state: StateSlice) => state[sliceName].nearbyOffersLoadingStatus;

export const getOffer = (state: StateSlice) => state[sliceName].offer;
export const getOfferLoadingStatus = (state: StateSlice) => state[sliceName].offerLoadingStatus;
