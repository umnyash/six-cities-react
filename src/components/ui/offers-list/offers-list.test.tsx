import { screen, render } from '@testing-library/react';

import { OffersListVariant } from './const';
import { OfferCardVariant } from '../offer-card';
import { getMockOffers } from '../../../data/mocks';
import OfferCard from '../offer-card';

import OffersList from './offers-list';

vi.mock('../offer-card', async () => {
  const originalModule = await vi.importActual('../offer-card');

  return {
    ...originalModule,
    default: vi.fn(() => null)
  };
});

describe('Component: OffersList', () => {
  const listElementTestId = 'offers-list';

  it('should render correctly', () => {
    const mockOffers = getMockOffers(2);
    const mockSetOfferId = vi.fn();

    render(<OffersList offers={mockOffers} setOfferId={mockSetOfferId} />);
    const listElement = screen.getByTestId(listElementTestId);
    const mockOfferCardCalls = vi.mocked(OfferCard).mock.calls;

    expect(listElement).toBeInTheDocument();
    expect(mockOfferCardCalls).toHaveLength(mockOffers.length);

    mockOfferCardCalls.forEach((call, index) => {
      expect(call[0]).toEqual({
        offer: mockOffers[index],
        variant: OfferCardVariant.Default,
        setOfferId: mockSetOfferId
      });
    });
  });

  it.each([
    {
      listVariant: undefined,
      listClassName: 'near-places__list places__list',
      cardVariant: OfferCardVariant.Default,
    },
    {
      listVariant: OffersListVariant.CenteredRows,
      listClassName: 'near-places__list places__list',
      cardVariant: OfferCardVariant.Default,
    },
    {
      listVariant: OffersListVariant.Rows,
      listClassName: 'cities__places-list places__list tabs__content',
      cardVariant: OfferCardVariant.Default,
    },
    {
      listVariant: OffersListVariant.Column,
      listClassName: 'favorites__places',
      cardVariant: OfferCardVariant.Compact,
    },
  ])(
    'should render list with $listClassName class and card with $cardVariant variant prop when list variant prop is $listVariant',
    ({ listVariant, listClassName, cardVariant }) => {
      const mockOffers = getMockOffers(1);

      render(<OffersList offers={mockOffers} variant={listVariant} />);
      const listElement = screen.getByTestId(listElementTestId);

      expect(listElement).toHaveAttribute('class', listClassName);
      expect(OfferCard).toHaveBeenCalledWith({
        offer: mockOffers[0],
        variant: cardVariant
      }, expect.anything());
    }
  );
});
