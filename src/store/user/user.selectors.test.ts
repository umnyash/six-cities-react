import { NameSpace, RequestStatus, AuthorizationStatus } from '../../const';
import { getMockUser } from '../../mocks/data';
import { getUser, getAuthorizationStatus, getLoggingInStatus } from './user.selectors';

describe('User selectors', () => {
  const nameSpace = NameSpace.User;

  const state = {
    [nameSpace]: {
      user: getMockUser(),
      authorizationStatus: AuthorizationStatus.Auth,
      loggingInStatus: RequestStatus.Success,
    },
  };

  it('should return', () => {
    const { user } = state[nameSpace];
    const result = getUser(state);
    expect(result).toEqual(user);
  });

  it('should return authorization status from state', () => {
    const { authorizationStatus } = state[nameSpace];
    const result = getAuthorizationStatus(state);
    expect(result).toBe(authorizationStatus);
  });

  it('should return logging in status from state', () => {
    const { loggingInStatus } = state[nameSpace];
    const result = getLoggingInStatus(state);
    expect(result).toBe(loggingInStatus);
  });
});
