import { RequestStatus } from '../../const';
import { ReviewsState } from '../../types/state';
import { reviews } from './reviews.slice';
import { getMockReviews, getMockReview } from '../../mocks/data';
import { fetchReviews, submitReview } from '../async-actions';

describe('Reviews slice', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: ReviewsState = {
      reviews: getMockReviews(2),
      reviewSubmittingStatus: RequestStatus.None,
    };
    const unknownAction = { type: '' };

    const result = reviews.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const expectedState: ReviewsState = {
      reviews: [],
      reviewSubmittingStatus: RequestStatus.None,
    };
    const unknownAction = { type: '' };

    const result = reviews.reducer(undefined, unknownAction);

    expect(result).toEqual(expectedState);
  });

  describe('fetchReviews', () => {
    it('should clear reviews data on "fetchReviews.pending" action', () => {
      const initialState: ReviewsState = {
        reviews: getMockReviews(2),
        reviewSubmittingStatus: RequestStatus.None,
      };
      const expectedState: ReviewsState = {
        reviews: [],
        reviewSubmittingStatus: RequestStatus.None,
      };

      const result = reviews.reducer(initialState, fetchReviews.pending);

      expect(result).toEqual(expectedState);
    });

    it('should set reviews data on "fetchReviews.fulfilled" action', () => {
      const mockReviews = getMockReviews(2);
      const expectedState: ReviewsState = {
        reviews: mockReviews,
        reviewSubmittingStatus: RequestStatus.None,
      };

      const result = reviews.reducer(undefined, fetchReviews.fulfilled(
        mockReviews, '', 'someOfferId'
      ));

      expect(result).toEqual(expectedState);
    });
  });

  describe('submitReview', () => {
    it('should set "Pending" review submitting status on "submitReview.pending" action', () => {
      const expectedState: ReviewsState = {
        reviews: [],
        reviewSubmittingStatus: RequestStatus.Pending,
      };

      const result = reviews.reducer(undefined, submitReview.pending);

      expect(result).toEqual(expectedState);
    });

    it('should add review to reviews data and set "Success" review submitting status on "submitReview.fulfilled" action', () => {
      const mockReviews = getMockReviews(4);
      const initialState: ReviewsState = {
        reviews: mockReviews,
        reviewSubmittingStatus: RequestStatus.Pending,
      };
      const mockNewReview = getMockReview();
      const mockNewReviewContent = { rating: mockNewReview.rating, comment: mockNewReview.comment };
      const expectedState: ReviewsState = {
        reviews: [...mockReviews, mockNewReview],
        reviewSubmittingStatus: RequestStatus.Success,
      };

      const result = reviews.reducer(initialState, submitReview.fulfilled(
        mockNewReview, '', { offerId: 'someOfferId', content: mockNewReviewContent }
      ));

      expect(result).toEqual(expectedState);
    });

    it('should set "Error" review submitting status on "submitReview.rejected" action', () => {
      const initialState: ReviewsState = {
        reviews: [],
        reviewSubmittingStatus: RequestStatus.Pending,
      };
      const expectedState: ReviewsState = {
        reviews: [],
        reviewSubmittingStatus: RequestStatus.Error,
      };

      const result = reviews.reducer(initialState, submitReview.rejected);

      expect(result).toEqual(expectedState);
    });
  });
});
