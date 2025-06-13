import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { NameSpace, SortingOption } from '../../const';
import { groupBy } from '../../util';

const sliceName = NameSpace.Catalog;
type StateSlice = Pick<State, NameSpace.Catalog>;

export const getAllOffers = (state: StateSlice) => state[sliceName].offers;

export const getAllOffersLoadingStatus = (state: StateSlice) => state[sliceName].loadingStatus;
export const getCity = (state: StateSlice) => state[sliceName].city;
export const getSorting = (state: StateSlice) => state[sliceName].sorting;

export const getAllOffersGroupedByCity = createSelector(
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
