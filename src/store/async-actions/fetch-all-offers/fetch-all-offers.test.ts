import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { Action } from 'redux';
import thunk from 'redux-thunk';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { State } from '../../../types/state';
import { createAPI, apiPaths } from '../../../services/api';
import { AppThunkDispatch } from '../../../tests/types';
import { getMockOffers } from '../../../data/mocks';
import { extractActionsTypes } from '../../../tests/util';

import { fetchAllOffers } from './fetch-all-offers';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchAllOffers', () => {
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
    mockAPIAdapter.onGet(apiPaths.offers()).networkError();

    await store.dispatch(fetchAllOffers());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "fetchAllOffers.pending", "fetchAllOffers.fulfilled" and return offers array when server responds with 200', async () => {
    const mockOffers = getMockOffers(2);
    mockAPIAdapter.onGet(apiPaths.offers()).reply(StatusCodes.OK, mockOffers);

    await store.dispatch(fetchAllOffers());
    const dispatchedActions = store.getActions();
    const actionsTypes = extractActionsTypes(store.getActions());
    const fetchAllOffersFulfilled = dispatchedActions[1] as ReturnType<typeof fetchAllOffers.fulfilled>;

    expect(actionsTypes).toEqual([
      fetchAllOffers.pending.type,
      fetchAllOffers.fulfilled.type,
    ]);
    expect(fetchAllOffersFulfilled.payload).toEqual(mockOffers);
  });
});
