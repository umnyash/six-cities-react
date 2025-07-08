import { screen, render } from '@testing-library/react';

import { getMockReview } from '../../../mocks/data';
import StarsIcon, { StarsIconSize } from '../stars-icon';

import ReviewsItem from './reviews-item';

vi.mock('../stars-icon', async () => {
  const originalModule = await vi.importActual('../stars-icon');

  return {
    ...originalModule,
    default: vi.fn(() => null)
  };
});

describe('Component: ReviewsItem', () => {
  it('should render correctly', () => {
    const mockReview = getMockReview();

    render(<ReviewsItem review={mockReview} />);
    const listItemElement = screen.getByRole('listitem');
    const avatarElement = screen.getByAltText('Reviews avatar');
    const authorNameElement = screen.getByText(mockReview.user.name);
    const dateElement = screen.getByRole('time');
    const reviewTextElement = screen.getByText(mockReview.comment);

    expect(listItemElement).toBeInTheDocument();
    expect(avatarElement).toHaveAttribute('src', mockReview.user.avatarUrl);
    expect(authorNameElement).toBeInTheDocument();
    expect(reviewTextElement).toBeInTheDocument();
    expect(dateElement).toHaveAttribute('dateTime', mockReview.date);
  });

  describe('should render date in the format "month year"', () => {
    it.each([
      ['2024-12-31', 'December 2024'],
      ['2025-04-01', 'April 2025'],
      ['2025-05-01', 'May 2025'],
    ])('should displayed %s as %s', (dateISOString, expected) => {
      const mockReview = getMockReview({ date: dateISOString });
      render(<ReviewsItem review={mockReview} />);
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  it('should correctly pass props to nested OffersList component', () => {
    const mockReview = getMockReview();

    render(<ReviewsItem review={mockReview} />);

    expect(StarsIcon).toHaveBeenCalledWith({
      rating: mockReview.rating,
      size: StarsIconSize.M,
      withHiddenValue: true,
    }, expect.anything());
  });
});
