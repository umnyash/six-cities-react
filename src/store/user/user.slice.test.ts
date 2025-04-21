import { RequestStatus, AuthorizationStatus } from '../../const';
import { AuthData } from '../../types/user';
import { UserState } from '../../types/state';
import { user } from './user.slice';
import { getMockUser } from '../../mocks/data';
import { checkUserAuth, loginUser, logoutUser } from '../async-actions';

describe('User slice', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: UserState = {
      user: getMockUser(),
      authorizationStatus: AuthorizationStatus.Auth,
      loggingInStatus: RequestStatus.Success,
    };
    const unknownAction = { type: '' };

    const result = user.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const expectedState: UserState = {
      user: null,
      authorizationStatus: AuthorizationStatus.Unknown,
      loggingInStatus: RequestStatus.None,
    };
    const unknownAction = { type: '' };

    const result = user.reducer(undefined, unknownAction);

    expect(result).toEqual(expectedState);
  });

  describe('checkUserAuth', () => {
    it('should set user data and "AUTH" authorization status on "checkUserAuth.fulfilled" action', () => {
      const mockUser = getMockUser();
      const expectedState: UserState = {
        user: mockUser,
        authorizationStatus: AuthorizationStatus.Auth,
        loggingInStatus: RequestStatus.None,
      };

      const result = user.reducer(undefined, checkUserAuth.fulfilled(
        mockUser, '', undefined
      ));

      expect(result).toEqual(expectedState);
    });

    it('should set "NO_AUTH" authorization status on "checkUserAuth.rejected" action', () => {
      const expectedState: UserState = {
        user: null,
        authorizationStatus: AuthorizationStatus.NoAuth,
        loggingInStatus: RequestStatus.None,
      };

      const result = user.reducer(undefined, checkUserAuth.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('loginUser', () => {
    const initialState: UserState = {
      user: null,
      authorizationStatus: AuthorizationStatus.NoAuth,
      loggingInStatus: RequestStatus.None,
    };

    it('should set "Pending" logging in status on "loginUser.pending" action ', () => {
      const expectedState: UserState = {
        user: null,
        authorizationStatus: AuthorizationStatus.NoAuth,
        loggingInStatus: RequestStatus.Pending,
      };

      const result = user.reducer(initialState, loginUser.pending);

      expect(result).toEqual(expectedState);
    });

    it('should set user data, "AUTH" authorization status and "Success" logging in status on "loginUser.fulfilled" action', () => {
      const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };
      const mockUser = getMockUser();
      const expectedState: UserState = {
        user: mockUser,
        authorizationStatus: AuthorizationStatus.Auth,
        loggingInStatus: RequestStatus.Success,
      };

      const result = user.reducer(initialState, loginUser.fulfilled(
        mockUser, '', mockAuthData
      ));

      expect(result).toEqual(expectedState);
    });

    it('should set "Error" logging in status on "loginUser.rejected" action', () => {
      const expectedState: UserState = {
        user: null,
        authorizationStatus: AuthorizationStatus.NoAuth,
        loggingInStatus: RequestStatus.Error,
      };

      const result = user.reducer(initialState, loginUser.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('logoutUser', () => {
    it('should clear user data and set "NO_AUTH" authorization status on "logoutUser.fulfilled" action', () => {
      const initialState: UserState = {
        user: getMockUser(),
        authorizationStatus: AuthorizationStatus.Auth,
        loggingInStatus: RequestStatus.Success,
      };
      const expectedState: UserState = {
        user: null,
        authorizationStatus: AuthorizationStatus.NoAuth,
        loggingInStatus: RequestStatus.Success,
      };

      const result = user.reducer(initialState, logoutUser.fulfilled);

      expect(result).toEqual(expectedState);
    });
  });
});
