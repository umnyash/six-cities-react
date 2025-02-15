import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.Favorites;

export const getFavorites = (state: State) => state[sliceName].favorites;
