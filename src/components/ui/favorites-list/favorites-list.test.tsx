import { screen, render } from '@testing-library/react';

import { CITIES } from '../../../const';
import { getMockOffers, getMockCity } from '../../../data/mocks';
import { OffersListVariant } from '../offers-list';
import OffersList from '../offers-list';

import FavoritesList from './favorites-list';

vi.mock('../offers-list', async () => {
  const originalModule = await vi.importActual('../offers-list');

  return {
    ...originalModule,
    default: vi.fn(() => null)
  };
});

describe('Component: FavoritesList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([1, 6])('should render correctly when offers are related to %i cities', (citiesCount) => {
    const offersCountForEachCity = 1;
    const cities = CITIES.slice(0, citiesCount);
    const mockOfferGroups = cities.map(
      (city) => getMockOffers(offersCountForEachCity, { city: getMockCity(city) })
    );
    const mockOffers = mockOfferGroups.flat();

    render(<FavoritesList offers={mockOffers} />);
    const mockOffersListCalls = vi.mocked(OffersList).mock.calls;
    const listElement = screen.getByRole('list');
    const listItemElements = screen.getAllByRole('listitem');

    expect(listElement).toBeInTheDocument();
    expect(listItemElements).toHaveLength(cities.length);
    cities.forEach(
      (city) => expect(screen.getByRole('link', { name: city })).toBeInTheDocument()
    );
    expect(mockOffersListCalls).toHaveLength(cities.length);
    mockOffersListCalls.forEach((call, index) => {
      expect(call[0]).toEqual({
        offers: mockOfferGroups[index],
        variant: OffersListVariant.Column
      });
    });
  });
});
