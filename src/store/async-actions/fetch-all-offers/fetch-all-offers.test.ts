import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { apiPaths } from '../../../services/api';
import { getMockOffers } from '../../../data/mocks';
import { createMockStore, extractActionsTypes } from '../../../tests/util';

import { fetchAllOffers } from './fetch-all-offers';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchAllOffers', () => {
  let mockStore: ReturnType<typeof createMockStore>['mockStore'];
  let mockAPIAdapter: ReturnType<typeof createMockStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ mockStore, mockAPIAdapter } = createMockStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(apiPaths.offers()).networkError();

    await mockStore.dispatch(fetchAllOffers());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "fetchAllOffers.pending", "fetchAllOffers.fulfilled" and return offers array when server responds with 200', async () => {
    const mockOffers = getMockOffers(2);
    mockAPIAdapter.onGet(apiPaths.offers()).reply(StatusCodes.OK, mockOffers);

    await mockStore.dispatch(fetchAllOffers());
    const dispatchedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(mockStore.getActions());
    const fetchAllOffersFulfilled = dispatchedActions[1] as ReturnType<typeof fetchAllOffers.fulfilled>;

    expect(actionsTypes).toEqual([
      fetchAllOffers.pending.type,
      fetchAllOffers.fulfilled.type,
    ]);
    expect(fetchAllOffersFulfilled.payload).toEqual(mockOffers);
  });
});
