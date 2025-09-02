import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { apiPaths } from '../../../services/api';
import { getMockReviews } from '../../../data/mocks';
import { createMockStore, extractActionsTypes } from '../../../tests/util';

import { fetchReviews } from './fetch-reviews';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchReviews', () => {
  let mockStore: ReturnType<typeof createMockStore>['mockStore'];
  let mockAPIAdapter: ReturnType<typeof createMockStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ mockStore, mockAPIAdapter } = createMockStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(apiPaths.reviews('existingOfferId')).networkError();

    await mockStore.dispatch(fetchReviews('existingOfferId'));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "fetchReviews.pending", "fetchReviews.fulfilled" and return reviews array when server responds with 200', async () => {
    const mockReviews = getMockReviews(2);
    mockAPIAdapter.onGet(apiPaths.reviews('existingOfferId')).reply(StatusCodes.OK, mockReviews);

    await mockStore.dispatch(fetchReviews('existingOfferId'));
    const dispatchedActions = mockStore.getActions();
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

    await mockStore.dispatch(fetchReviews('nonExistentOfferId'));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      fetchReviews.pending.type,
      fetchReviews.rejected.type,
    ]);
  });
});
