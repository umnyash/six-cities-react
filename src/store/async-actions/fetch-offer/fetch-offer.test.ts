import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { apiPaths } from '../../../services/api';
import { getMockOffer } from '../../../data/mocks';
import { createMockStore, extractActionsTypes } from '../../../tests/util';

import { fetchOffer } from './fetch-offer';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchOffer', () => {
  let mockStore: ReturnType<typeof createMockStore>['mockStore'];
  let mockAPIAdapter: ReturnType<typeof createMockStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ mockStore, mockAPIAdapter } = createMockStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(apiPaths.offer('existingOfferId')).networkError();

    await mockStore.dispatch(fetchOffer('existingOfferId'));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "fetchOffer.pending", "fetchOffer.fulfilled" and return offer data when server responds with 200', async () => {
    const mockOffer = getMockOffer();
    mockAPIAdapter.onGet(apiPaths.offer('existingOfferId')).reply(StatusCodes.OK, mockOffer);

    await mockStore.dispatch(fetchOffer('existingOfferId'));
    const dispatchedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const fetchOfferFulfilled = dispatchedActions[1] as ReturnType<typeof fetchOffer.fulfilled>;

    expect(actionsTypes).toEqual([
      fetchOffer.pending.type,
      fetchOffer.fulfilled.type,
    ]);
    expect(fetchOfferFulfilled.payload).toEqual(mockOffer);
  });

  it('should dispatch "fetchOffer.pending", "fetchOffer.rejected" when server responds with 404', async () => {
    mockAPIAdapter.onGet(apiPaths.offer('nonExistentOfferId')).reply(StatusCodes.NOT_FOUND);

    await mockStore.dispatch(fetchOffer('nonExistentOfferId'));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      fetchOffer.pending.type,
      fetchOffer.rejected.type,
    ]);
  });
});
