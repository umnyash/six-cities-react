import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { Action } from 'redux';
import thunk from 'redux-thunk';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { State } from '../../../types/state';
import { createAPI, apiPaths } from '../../../services/api';
import { AppThunkDispatch } from '../../../mocks/types';
import { getMockOffers } from '../../../data/mocks';
import { extractActionsTypes } from '../../../mocks/util';

import { fetchFavorites } from './fetch-favorites';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchFavorites', () => {
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
    mockAPIAdapter.onGet(apiPaths.favorites()).networkError();

    await store.dispatch(fetchFavorites());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "fetchFavorites.pending", "fetchFavorites.fulfilled" and return offers array when server responds with 200', async () => {
    const mockOffers = getMockOffers(2);
    mockAPIAdapter.onGet(apiPaths.favorites()).reply(StatusCodes.OK, mockOffers);

    await store.dispatch(fetchFavorites());
    const dispatchedActions = store.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const fetchFavoritesFulfilled = dispatchedActions[1] as ReturnType<typeof fetchFavorites.fulfilled>;

    expect(actionsTypes).toEqual([
      fetchFavorites.pending.type,
      fetchFavorites.fulfilled.type,
    ]);
    expect(fetchFavoritesFulfilled.payload).toEqual(mockOffers);
  });

  it('should dispatch "fetchFavorites.pending" and "fetchFavorites.rejected" when server responds with 401', async () => {
    mockAPIAdapter.onGet(apiPaths.favorites()).reply(StatusCodes.UNAUTHORIZED);

    await store.dispatch(fetchFavorites());
    const actionsTypes = extractActionsTypes(store.getActions());

    expect(actionsTypes).toEqual([
      fetchFavorites.pending.type,
      fetchFavorites.rejected.type,
    ]);
  });
});
