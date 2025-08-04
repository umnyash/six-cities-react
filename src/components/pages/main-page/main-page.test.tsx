import { screen, render } from '@testing-library/react';

import { RequestStatus, NameSpace, CITIES, SortingOption } from '../../../const';
import { State } from '../../../types/state';
import { getMockOffers, getMockCity } from '../../../mocks/data';
import { withStore } from '../../../mocks/render-helpers';
import CitiesList from '../../ui/cities-list';

import MainPage from './main-page';

vi.mock('../../ui/cities-list', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../ui/spinner', () => ({
  default: vi.fn(() => <h2>Spinner</h2>)
}));

vi.mock('../../blocks/catalog-error', () => ({
  default: vi.fn(() => <h2>CatalogError</h2>)
}));

vi.mock('../../blocks/catalog-map', () => ({
  default: vi.fn(() => <h3>CatalogMap</h3>)
}));

vi.mock('../../blocks/catalog-placeholder', () => ({
  default: vi.fn(() => <h2>CatalogPlaceholder</h2>)
}));

vi.mock('../../blocks/catalog-offers', () => ({
  default: vi.fn(() => <h2>CatalogOffers</h2>)
}));

describe('Component: MainPage', () => {
  let mockInitialState: Pick<State, NameSpace.Catalog>;
  const activeCity = CITIES[1];

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.Catalog]: {
        offers: [],
        loadingStatus: RequestStatus.None,
        city: activeCity,
        sorting: SortingOption.Default,
        activeOfferId: '',
      }
    };

    vi.clearAllMocks();
  });

  it('should render heading and cities list in any case', () => {
    const { withStoreComponent } = withStore(<MainPage />, mockInitialState);

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading', { name: 'Cities' });

    expect(headingElement).toBeInTheDocument();
    expect(CitiesList).toHaveBeenCalledOnce();
  });

  describe('other elements except heading and cities list', () => {
    it.each([
      {
        case: 'should render only spinner when loading status is "Pending"',
        loadingStatus: RequestStatus.Pending,
        offers: [],
        componentsHeadings: ['Spinner', null],
      },
      {
        case: 'should render only catalog error when loading status is "Error"',
        loadingStatus: RequestStatus.Error,
        offers: [],
        componentsHeadings: ['CatalogError', null],
      },
      {
        case: 'should render only catalog no offers when loading status is "Succes" and no offers for active city',
        loadingStatus: RequestStatus.Success,
        offers: [],
        componentsHeadings: ['CatalogPlaceholder', null],
      },
      {
        case: 'should render only catalog offers and catalog map when loading status is "Succes" and there are offers for active city',
        loadingStatus: RequestStatus.Success,
        offers: getMockOffers(2, { city: getMockCity(activeCity) }),
        componentsHeadings: ['CatalogOffers', 'CatalogMap'],
      },
    ])('$case', ({ loadingStatus, offers, componentsHeadings }) => {
      mockInitialState[NameSpace.Catalog].loadingStatus = loadingStatus;
      mockInitialState[NameSpace.Catalog].offers = offers;
      const { withStoreComponent } = withStore(<MainPage />, mockInitialState);

      render(withStoreComponent);
      const only2LevelHeadingElement = screen.getByRole('heading', { level: 2 });

      expect(only2LevelHeadingElement).toHaveTextContent(componentsHeadings[0] as string);

      if (componentsHeadings[1]) {
        const only3LevelHeadingElement = screen.getByRole('heading', { level: 3 });
        expect(only3LevelHeadingElement).toHaveTextContent(componentsHeadings[1]);
      } else {
        expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
      }
    });
  });
});
