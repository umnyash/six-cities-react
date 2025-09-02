import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { apiPaths } from '../../../services/api';
import { getMockReview } from '../../../data/mocks';
import { createMockStore, extractActionsTypes } from '../../../tests/util';

import { submitReview } from './submit-review';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: submitReview', () => {
  let mockStore: ReturnType<typeof createMockStore>['mockStore'];
  let mockAPIAdapter: ReturnType<typeof createMockStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ mockStore, mockAPIAdapter } = createMockStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    const mockNewReview = getMockReview();
    const mockNewReviewContent = { rating: mockNewReview.rating, comment: mockNewReview.comment };
    mockAPIAdapter.onPost(apiPaths.reviews('existingOfferId')).networkError();

    await mockStore.dispatch(submitReview({ offerId: 'existingOfferId', content: mockNewReviewContent }));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "submitReview.pending", "submitReview.fulfilled" and return review when server responds with 201', async () => {
    const mockNewReview = getMockReview();
    const mockNewReviewContent = { rating: mockNewReview.rating, comment: mockNewReview.comment };
    mockAPIAdapter.onPost(apiPaths.reviews('existingOfferId')).reply(StatusCodes.CREATED, mockNewReview);

    await mockStore.dispatch(submitReview({ offerId: 'existingOfferId', content: mockNewReviewContent }));
    const dispatchedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const submitReviewFulfilled = dispatchedActions[1] as ReturnType<typeof submitReview.fulfilled>;

    expect(actionsTypes).toEqual([
      submitReview.pending.type,
      submitReview.fulfilled.type,
    ]);
    expect(submitReviewFulfilled.payload).toEqual(mockNewReview);
  });

  it('should dispatch "submitReview.pending" and "submitReview.rejected" when server responds with 400', async () => {
    const mockReviewContent = { rating: 0, comment: 'comment text with invalid length' };
    mockAPIAdapter.onPost(apiPaths.reviews('nonExistentOfferId')).reply(StatusCodes.BAD_REQUEST);

    await mockStore.dispatch(submitReview({ offerId: 'nonExistentOfferId', content: mockReviewContent }));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      submitReview.pending.type,
      submitReview.rejected.type,
    ]);
  });

  it('should call "toast.warn" once with error message when server responds with 400', async () => {
    const mockReviewContent = { rating: 0, comment: 'comment text with invalid length' };
    const errorMessage = 'bad request';
    mockAPIAdapter
      .onPost(apiPaths.reviews('nonExistentOfferId'))
      .reply(StatusCodes.BAD_REQUEST, { message: errorMessage });

    await mockStore.dispatch(submitReview({ offerId: 'nonExistentOfferId', content: mockReviewContent }));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(errorMessage);
  });

  it('should dispatch "submitReview.pending" and "submitReview.rejected" when server responds with 401', async () => {
    const mockReviewContent = { rating: 5, comment: 'comment text with valid length' };
    mockAPIAdapter.onPost(apiPaths.reviews('nonExistentOfferId')).reply(StatusCodes.UNAUTHORIZED);

    await mockStore.dispatch(submitReview({ offerId: 'nonExistentOfferId', content: mockReviewContent }));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      submitReview.pending.type,
      submitReview.rejected.type,
    ]);
  });

  it('should dispatch "submitReview.pending" and "submitReview.rejected" when server responds with 404', async () => {
    const mockReviewContent = { rating: 5, comment: 'comment text with valid length' };
    mockAPIAdapter.onPost(apiPaths.reviews('nonExistentOfferId')).reply(StatusCodes.NOT_FOUND);

    await mockStore.dispatch(submitReview({ offerId: 'nonExistentOfferId', content: mockReviewContent }));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      submitReview.pending.type,
      submitReview.rejected.type,
    ]);
  });
});
