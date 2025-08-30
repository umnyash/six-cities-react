import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { Action } from 'redux';
import thunk from 'redux-thunk';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { State } from '../../../types/state';
import { createAPI, apiPaths } from '../../../services/api';
import * as tokenStorage from '../../../services/token';
import { AppThunkDispatch } from '../../../tests/types';
import { extractActionsTypes } from '../../../tests/util';

import { logoutUser } from './logout-user';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: logoutUser', () => {
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
    mockAPIAdapter.onDelete(apiPaths.logout()).networkError();

    await store.dispatch(logoutUser());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "logoutUser.pending" and "logoutUser.fulfilled" when server responds with 204', async () => {
    mockAPIAdapter.onDelete(apiPaths.logout()).reply(StatusCodes.NO_CONTENT);

    await store.dispatch(logoutUser());
    const actionsTypes = extractActionsTypes(store.getActions());

    expect(actionsTypes).toEqual([
      logoutUser.pending.type,
      logoutUser.fulfilled.type,
    ]);
  });

  it('should call "dropToken" once on logout', async () => {
    mockAPIAdapter.onDelete(apiPaths.logout()).reply(StatusCodes.NO_CONTENT);
    const mockDropToken = vi.spyOn(tokenStorage, 'dropToken');

    await store.dispatch(logoutUser());

    expect(mockDropToken).toHaveBeenCalledTimes(1);
  });
});
