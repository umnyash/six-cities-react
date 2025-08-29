import { screen, render } from '@testing-library/react';
import { getMockReviews } from '../../../data/mocks';
import ReviewsList from './reviews-list';

describe('Component: ReviewsList', () => {
  it('should render correctly', () => {
    const expectedReviewsCount = 2;
    const mockReviews = getMockReviews(expectedReviewsCount);

    render(<ReviewsList reviews={mockReviews} />);
    const reviewsItems = screen.getAllByRole('listitem');

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(reviewsItems).toHaveLength(expectedReviewsCount);
    mockReviews.forEach(
      (review) => expect(screen.getByText(review.comment)).toBeInTheDocument()
    );
  });
});
