import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { apiPaths } from '../../../services/api';
import { getMockOffers } from '../../../data/mocks';
import { createMockStore, extractActionsTypes } from '../../../tests/util';

import { fetchFavorites } from './fetch-favorites';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchFavorites', () => {
  let mockStore: ReturnType<typeof createMockStore>['mockStore'];
  let mockAPIAdapter: ReturnType<typeof createMockStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ mockStore, mockAPIAdapter } = createMockStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(apiPaths.favorites()).networkError();

    await mockStore.dispatch(fetchFavorites());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "fetchFavorites.pending", "fetchFavorites.fulfilled" and return offers array when server responds with 200', async () => {
    const mockOffers = getMockOffers(2);
    mockAPIAdapter.onGet(apiPaths.favorites()).reply(StatusCodes.OK, mockOffers);

    await mockStore.dispatch(fetchFavorites());
    const dispatchedActions = mockStore.getActions();
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

    await mockStore.dispatch(fetchFavorites());
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      fetchFavorites.pending.type,
      fetchFavorites.rejected.type,
    ]);
  });
});
