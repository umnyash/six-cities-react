import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.Catalog;

export const getCity = (state: State) => state[sliceName].city;
