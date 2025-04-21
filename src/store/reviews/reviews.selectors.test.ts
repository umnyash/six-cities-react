import { NameSpace, RequestStatus, REVIEWS_MAX_COUNT } from '../../const';
import { getReviews, getLatestReviews, getReviewSubmittingStatus } from './reviews.selectors';
import { getMockReviews } from '../../mocks/data';

describe('Reviews selector', () => {
  const nameSpace = NameSpace.Reviews;
  const mockReviews = getMockReviews(16);

  const state = {
    [nameSpace]: {
      reviews: mockReviews,
      reviewSubmittingStatus: RequestStatus.Success,
    },
  };

  it('should return reviews from state', () => {
    const { reviews } = state[nameSpace];
    const result = getReviews(state);
    expect(result).toEqual(reviews);
  });

  it('should return latest 10 reviews from state', () => {
    const expectedReviews = mockReviews
      .toSorted((a, b) => (a.date < b.date) ? 1 : -1)
      .slice(0, REVIEWS_MAX_COUNT);

    const result = getLatestReviews(state);

    expect(result).toEqual(expectedReviews);
  });

  it('should return review submitting status from state', () => {
    const { reviewSubmittingStatus } = state[nameSpace];
    const result = getReviewSubmittingStatus(state);
    expect(result).toBe(reviewSubmittingStatus);
  });
});
