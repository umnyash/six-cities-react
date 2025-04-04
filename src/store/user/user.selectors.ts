import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.User;
type StateSlice = Pick<State, NameSpace.User>;

export const getUser = (state: StateSlice) => state[sliceName].user;

export const getAuthorizationStatus = (state: StateSlice) => state[sliceName].authorizationStatus;

export const getLoggingInStatus = (state: StateSlice) => state[sliceName].loggingInStatus;
