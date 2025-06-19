import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { Action } from 'redux';
import thunk from 'redux-thunk';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { State } from '../../../types/state';
import { createAPI, apiPaths } from '../../../services/api';
import { AppThunkDispatch } from '../../../mocks/types';
import { getMockReviews } from '../../../mocks/data';
import { extractActionsTypes } from '../../../mocks/util';

import { fetchReviews } from './fetch-reviews';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchReviews', () => {
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
    mockAPIAdapter.onGet(apiPaths.reviews('existingOfferId')).networkError();

    await store.dispatch(fetchReviews('existingOfferId'));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "fetchReviews.pending", "fetchReviews.fulfilled" and return reviews array when server responds with 200', async () => {
    const mockReviews = getMockReviews(2);
    mockAPIAdapter.onGet(apiPaths.reviews('existingOfferId')).reply(StatusCodes.OK, mockReviews);

    await store.dispatch(fetchReviews('existingOfferId'));
    const dispatchedActions = store.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const fetchReviewsFulfilled = dispatchedActions[1] as ReturnType<typeof fetchReviews.fulfilled>;

    expect(actionsTypes).toEqual([
      fetchReviews.pending.type,
      fetchReviews.fulfilled.type,
    ]);
    expect(fetchReviewsFulfilled.payload).toEqual(mockReviews);
  });

  it('should dispatch "fetchReviews.pending" and "fetchReviews.rejected" when server responds with 404', async () => {
    mockAPIAdapter.onGet(apiPaths.reviews('nonExistentOfferId')).reply(StatusCodes.NOT_FOUND);

    await store.dispatch(fetchReviews('nonExistentOfferId'));
    const actionsTypes = extractActionsTypes(store.getActions());

    expect(actionsTypes).toEqual([
      fetchReviews.pending.type,
      fetchReviews.rejected.type,
    ]);
  });
});
