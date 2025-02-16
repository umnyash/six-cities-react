import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.Offers;

export const getAllOffers = (state: State) => state[sliceName].allOffers;
export const getAllOffersLoadingStatus = (state: State) => state[sliceName].allOffersLoadingStatus;

export const getNearbyOffers = (state: State) => state[sliceName].nearbyOffers;
