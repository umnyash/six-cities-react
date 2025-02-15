import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.Offers;

export const getOffers = (state: State) => state[sliceName].offers;
export const getOffersLoadingStatus = (state: State) => state[sliceName].isOffersLoading;

export const getNearbyOffers = (state: State) => state[sliceName].nearbyOffers;
