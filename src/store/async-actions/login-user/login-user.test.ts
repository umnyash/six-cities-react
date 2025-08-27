import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { Action } from 'redux';
import thunk from 'redux-thunk';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { State } from '../../../types/state';
import { AuthData, AuthUser } from '../../../types/user';
import { createAPI, apiPaths } from '../../../services/api';
import * as tokenStorage from '../../../services/token';
import { AppThunkDispatch } from '../../../mocks/types';
import { getMockAuthUser } from '../../../mocks/data';
import { extractActionsTypes } from '../../../mocks/util';
import { omit } from '../../../util';

import { loginUser } from './login-user';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: loginUser', () => {
  const api = createAPI();
  const mockAPIAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({ CATALOG: { offers: [] } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };
    mockAPIAdapter.onPost(apiPaths.login()).networkError();

    await store.dispatch(loginUser(mockAuthData));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "loginUser.pending", "loginUser.fulfilled" and return user data when server responds with 201', async () => {
    const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };
    const mockAuthUser: AuthUser = getMockAuthUser();
    const mockUser = omit(mockAuthUser, 'token');
    mockAPIAdapter.onPost(apiPaths.login()).reply(StatusCodes.CREATED, mockAuthUser);

    await store.dispatch(loginUser(mockAuthData));
    const dispatchedActions = store.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const loginUserFulfilled = dispatchedActions[1] as ReturnType<typeof loginUser.fulfilled>;

    expect(actionsTypes).toEqual([
      loginUser.pending.type,
      loginUser.fulfilled.type,
    ]);
    expect(loginUserFulfilled.payload).toEqual(mockUser);
  });

  it('should call "saveToken" once with the received token on login', async () => {
    const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };
    const mockAuthUser: AuthUser = getMockAuthUser();
    mockAPIAdapter.onPost(apiPaths.login()).reply(StatusCodes.CREATED, mockAuthUser);
    const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

    await store.dispatch(loginUser(mockAuthData));

    expect(mockSaveToken).toHaveBeenCalledTimes(1);
    expect(mockSaveToken).toHaveBeenCalledWith(mockAuthUser.token);
  });

  it('should dispatch "loginUser.pending" and "loginUser.rejected" when server responds with 400', async () => {
    const mockInvalidAuthData: AuthData = { email: 'test', password: '0000' };
    mockAPIAdapter.onPost(apiPaths.login()).reply(StatusCodes.BAD_REQUEST);

    await store.dispatch(loginUser(mockInvalidAuthData));
    const actionsTypes = extractActionsTypes(store.getActions());

    expect(actionsTypes).toEqual([
      loginUser.pending.type,
      loginUser.rejected.type,
    ]);
  });

  it('should call "toast.warn" once with error message when server responds with 400', async () => {
    const mockInvalidAuthData: AuthData = { email: 'test', password: '0000' };
    const errorMessage = 'bad request';
    mockAPIAdapter.onPost(apiPaths.login()).reply(StatusCodes.BAD_REQUEST, { message: errorMessage });

    await store.dispatch(loginUser(mockInvalidAuthData));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(errorMessage);
  });
});
