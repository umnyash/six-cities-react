import { render } from '@testing-library/react';

import { RequestStatus, NameSpace, CITIES, SortingOption } from '../../../const';
import { getMockOffers, getMockCity } from '../../../data/mocks';
import { withStore } from '../../../tests/render-helpers';
import Map from '../map';

import CatalogMap from './catalog-map';

vi.mock('../map', () => ({
  default: vi.fn(() => null)
}));

describe('Component: CatalogMap', () => {
  it('should correctly call nested Map component', () => {
    const activeCity = CITIES[0];
    const mockOffers = getMockOffers(2, { city: getMockCity(activeCity) });
    const activeOfferId = mockOffers[1].id;
    const mockInitialState = {
      [NameSpace.Catalog]: {
        offers: mockOffers,
        loadingStatus: RequestStatus.None,
        filter: {
          city: activeCity,
        },
        sorting: SortingOption.Default,
        activeOfferId,
      }
    };
    const { withStoreComponent } = withStore(<CatalogMap />, mockInitialState);

    render(withStoreComponent);

    expect(Map).toHaveBeenCalledOnce();
    expect(Map).toHaveBeenCalledWith(
      {
        className: 'cities__map',
        location: mockOffers[0].city.location,
        points: mockOffers,
        activePointId: activeOfferId,
      },
      expect.anything()
    );
  });
});
