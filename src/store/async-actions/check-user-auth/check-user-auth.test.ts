import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { Action } from 'redux';
import thunk from 'redux-thunk';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { State } from '../../../types/state';
import { AuthUser } from '../../../types/user';
import { createAPI, apiPaths } from '../../../services/api';
import { AppThunkDispatch } from '../../../tests/types';
import { getMockAuthUser } from '../../../data/mocks';
import { extractActionsTypes } from '../../../tests/util';
import { omit } from '../../../util';

import { checkUserAuth } from './check-user-auth';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: checkUserAuth', () => {
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
    mockAPIAdapter.onGet(apiPaths.login()).networkError();

    await store.dispatch(checkUserAuth());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "checkUserAuth.pending", "checkUserAuth.fulfilled" and return user data when server responds with 200', async () => {
    const mockAuthUser: AuthUser = getMockAuthUser();
    const mockUser = omit(mockAuthUser, 'token');
    mockAPIAdapter.onGet(apiPaths.login()).reply(StatusCodes.OK, mockAuthUser);

    await store.dispatch(checkUserAuth());
    const dispatchedActions = store.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const checkUserAuthFulfilled = dispatchedActions[1] as ReturnType<typeof checkUserAuth.fulfilled>;

    expect(actionsTypes).toEqual([
      checkUserAuth.pending.type,
      checkUserAuth.fulfilled.type,
    ]);
    expect(checkUserAuthFulfilled.payload).toMatchObject(mockUser);
  });

  it('should dispatch "checkUserAuth.pending" and "checkUserAuth.rejected" when server responds with 401', async () => {
    mockAPIAdapter.onGet(apiPaths.login()).reply(StatusCodes.UNAUTHORIZED);

    await store.dispatch(checkUserAuth());
    const actionsTypes = extractActionsTypes(store.getActions());

    expect(actionsTypes).toEqual([
      checkUserAuth.pending.type,
      checkUserAuth.rejected.type,
    ]);
  });
});
