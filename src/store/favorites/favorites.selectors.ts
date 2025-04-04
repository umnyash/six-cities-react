import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.Favorites;
type StateSlice = Pick<State, NameSpace.Favorites>;

export const getFavorites = (state: StateSlice) => state[sliceName].favorites;

export const getFavoritesLoadingStatus = (state: StateSlice) => state[sliceName].loadingStatus;

export const getChangingOffersIds = (state: StateSlice) => state[sliceName].changingOffersIds;
