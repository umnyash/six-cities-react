import { State } from '../../types/state';
import { NameSpace } from '../../const';

const sliceName = NameSpace.User;

export const getUser = (state: State) => state[sliceName].user;

export const getAuthorizationStatus = (state: State) => state[sliceName].authorizationStatus;

export const getLoggingInStatus = (state: State) => state[sliceName].loggingInStatus;
