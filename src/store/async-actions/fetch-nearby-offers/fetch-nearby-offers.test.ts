import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { Action } from 'redux';
import thunk from 'redux-thunk';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { State } from '../../../types/state';
import { createAPI, apiPaths } from '../../../services/api';
import { AppThunkDispatch } from '../../../mocks/types';
import { getMockOffers } from '../../../mocks/data';
import { extractActionsTypes } from '../../../mocks/util';

import { fetchNearbyOffers } from './fetch-nearby-offers';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchNearbyOffers', () => {
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
    mockAPIAdapter.onGet(apiPaths.nearbyOffers('existingOfferId')).networkError();

    await store.dispatch(fetchNearbyOffers('existingOfferId'));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "fetchNearbyOffers.pending", "fetchNearbyOffers.fulfilled" and offers array when server responds with 200', async () => {
    const mockOffers = getMockOffers(2);
    mockAPIAdapter.onGet(apiPaths.nearbyOffers('existingOfferId')).reply(StatusCodes.OK, mockOffers);

    await store.dispatch(fetchNearbyOffers('existingOfferId'));
    const dispatchedAcitons = store.getActions();
    const actionsTypes = extractActionsTypes(dispatchedAcitons);
    const fetchNearbyOffersFulfilled = dispatchedAcitons[1] as ReturnType<typeof fetchNearbyOffers.fulfilled>;

    expect(actionsTypes).toEqual([
      fetchNearbyOffers.pending.type,
      fetchNearbyOffers.fulfilled.type,
    ]);
    expect(fetchNearbyOffersFulfilled.payload).toEqual(mockOffers);
  });

  it('should dispatch "fetchNearbyOffers.pending" and "fetchNearbyOffers.rejected" when server responds with 404', async () => {
    mockAPIAdapter.onGet(apiPaths.nearbyOffers('nonExistentOfferId')).reply(StatusCodes.NOT_FOUND);

    await store.dispatch(fetchNearbyOffers('nonExistentOfferId'));
    const actionsTypes = extractActionsTypes(store.getActions());

    expect(actionsTypes).toEqual([
      fetchNearbyOffers.pending.type,
      fetchNearbyOffers.rejected.type,
    ]);
  });
});
