import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.NearbyOffers;
type StateSlice = Pick<State, NameSpace.NearbyOffers>;

export const getNearbyOffers = (state: StateSlice) => state[sliceName].offers;
export const getNearbyOffersLoadingStatus = (state: StateSlice) => state[sliceName].loadingStatus;
