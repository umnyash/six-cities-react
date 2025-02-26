import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { NameSpace, SortingOption } from '../../const';
import { groupBy } from '../../util';

const sliceName = NameSpace.Offers;

const getAllOffers = (state: State) => state[sliceName].allOffers;

export const getAllOffersLoadingStatus = (state: State) => state[sliceName].allOffersLoadingStatus;
export const getCity = (state: State) => state[sliceName].city;
export const getSorting = (state: State) => state[sliceName].sorting;

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

export const getNearbyOffers = (state: State) => state[sliceName].nearbyOffers;

export const getOffer = (state: State) => state[sliceName].offer;
export const getOfferLoadingStatus = (state: State) => state[sliceName].offerLoadingStatus;
