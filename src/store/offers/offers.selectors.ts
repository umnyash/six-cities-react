import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.Offers;

export const getAllOffers = (state: State) => state[sliceName].allOffers;
export const getAllOffersLoadingStatus = (state: State) => state[sliceName].allOffersLoadingStatus;
export const getCity = (state: State) => state[sliceName].city;
export const getSorting = (state: State) => state[sliceName].sorting;

export const getNearbyOffers = (state: State) => state[sliceName].nearbyOffers;

export const getOffer = (state: State) => state[sliceName].offer;
export const getOfferLoadingStatus = (state: State) => state[sliceName].offerLoadingStatus;
