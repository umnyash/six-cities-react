import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.Offer;
type StateSlice = Pick<State, NameSpace.Offer>;

export const getOffer = (state: StateSlice) => state[sliceName].offer;
export const getOfferLoadingStatus = (state: StateSlice) => state[sliceName].loadingStatus;
