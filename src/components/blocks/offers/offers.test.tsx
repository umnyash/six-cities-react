import { screen, render } from '@testing-library/react';

import { getMockOffers } from '../../../data/mocks';
import OffersList from '../../ui/offers-list';

import Offers from './offers';

vi.mock('../../ui/offers-list', () => ({
  default: vi.fn(() => null)
}));

describe('Component: Offers', () => {
  const mockOffers = getMockOffers(1);
  const mockHeading = 'Other places in the neighbourhood';

  it('should render correctly', () => {
    render(<Offers heading={mockHeading} offers={mockOffers} />);
    expect(screen.getByRole('heading', { name: mockHeading })).toBeInTheDocument();
  });

  it('should correctly pass props to nested OffersList component', () => {
    render(<Offers heading={mockHeading} offers={mockOffers} />);

    expect(OffersList).toHaveBeenCalledWith(
      { offers: mockOffers },
      expect.anything()
    );
  });
});
