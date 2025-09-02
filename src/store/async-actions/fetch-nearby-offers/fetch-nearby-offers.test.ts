import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { apiPaths } from '../../../services/api';
import { getMockOffers } from '../../../data/mocks';
import { createMockStore, extractActionsTypes } from '../../../tests/util';

import { fetchNearbyOffers } from './fetch-nearby-offers';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchNearbyOffers', () => {
  let mockStore: ReturnType<typeof createMockStore>['mockStore'];
  let mockAPIAdapter: ReturnType<typeof createMockStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ mockStore, mockAPIAdapter } = createMockStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(apiPaths.nearbyOffers('existingOfferId')).networkError();

    await mockStore.dispatch(fetchNearbyOffers('existingOfferId'));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "fetchNearbyOffers.pending", "fetchNearbyOffers.fulfilled" and offers array when server responds with 200', async () => {
    const mockOffers = getMockOffers(2);
    mockAPIAdapter.onGet(apiPaths.nearbyOffers('existingOfferId')).reply(StatusCodes.OK, mockOffers);

    await mockStore.dispatch(fetchNearbyOffers('existingOfferId'));
    const dispatchedAcitons = mockStore.getActions();
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

    await mockStore.dispatch(fetchNearbyOffers('nonExistentOfferId'));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      fetchNearbyOffers.pending.type,
      fetchNearbyOffers.rejected.type,
    ]);
  });
});
