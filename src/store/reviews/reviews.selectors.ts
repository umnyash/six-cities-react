import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.Reviews;

export const getReviews = (state: State) => state[sliceName].reviews;
