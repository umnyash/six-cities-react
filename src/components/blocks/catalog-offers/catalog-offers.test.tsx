import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CITIES, RequestStatus, AuthorizationStatus, SortingOption, NameSpace } from '../../../const';
import { State } from '../../../types/state';
import { getMockOffers, getMockCity } from '../../../data/mocks';
import { withHistory, withStore } from '../../../tests/render-helpers';
import { setActiveOfferId } from '../../../store/catalog/catalog.slice';
import Sorting from '../../ui/sorting';

import CatalogOffers from './catalog-offers';

vi.mock('../../ui/sorting', () => ({
  default: vi.fn(() => null)
}));

describe('Component: CatalogOffers', () => {
  const heading = 'Places';
  const offersListTestId = 'offers-list';
  const offersListVariantClassName = 'cities__places-list places__list tabs__content';
  const activeCity = CITIES[4];
  let mockInitialState: Pick<State, NameSpace.User | NameSpace.Catalog | NameSpace.Favorites>;

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.User]: {
        user: null,
        authorizationStatus: AuthorizationStatus.NoAuth,
        loggingInStatus: RequestStatus.None,
      },
      [NameSpace.Catalog]: {
        offers: [],
        loadingStatus: RequestStatus.Success,
        city: activeCity,
        sorting: SortingOption.Default,
        activeOfferId: '',
      },
      [NameSpace.Favorites]: {
        offers: [],
        loadingStatus: RequestStatus.Success,
        changingOffersIds: [],
      }
    };

    vi.clearAllMocks();
  });

  it('should rendered correctly', () => {
    const offersCount = 2;
    const mockOffers = getMockOffers(offersCount, { city: getMockCity(activeCity) });
    mockInitialState[NameSpace.Catalog].offers = mockOffers;
    const withHistoryComponent = withHistory(<CatalogOffers />);
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading', { name: heading });
    const textElement = screen.getByText(`${offersCount} places to stay in ${activeCity}`);
    const offersListElement = screen.getByTestId(offersListTestId);
    const offerCardElements = screen.getAllByRole('article');

    expect(headingElement).toBeInTheDocument();
    expect(textElement).toBeInTheDocument();
    expect(Sorting).toHaveBeenCalledOnce();
    expect(offersListElement).toBeInTheDocument();
    expect(offersListElement).toHaveAttribute('class', offersListVariantClassName);
    expect(offerCardElements).toHaveLength(offersCount);
  });

  describe('Search result text', () => {
    it.each([
      {
        condition: 'there is only one offer',
        offersCount: 1,
        word: 'place',
      },
      {
        condition: 'there are multiple offers',
        offersCount: 2,
        word: 'places',
      }
    ])('should render "$word" word when $condition', ({ word, offersCount }) => {
      const mockOffers = getMockOffers(offersCount, { city: getMockCity(activeCity) });
      mockInitialState[NameSpace.Catalog].offers = mockOffers;
      const withHistoryComponent = withHistory(<CatalogOffers />);
      const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);
      const expectedText = `${offersCount} ${word} to stay in ${activeCity}`;

      render(withStoreComponent);
      const searchResultText = screen.getByText(expectedText);

      expect(searchResultText).toBeInTheDocument();
    });
  });

  it('should correctly pass setCatalogOfferId callback to offers list', async () => {
    const mockOffers = getMockOffers(1, { city: getMockCity(activeCity) });
    mockInitialState[NameSpace.Catalog].offers = mockOffers;
    const withHistoryComponent = withHistory(<CatalogOffers />);
    const { withStoreComponent, mockStore } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);
    const offerCardElement = screen.getByRole('article');
    await userEvent.hover(offerCardElement);
    await userEvent.unhover(offerCardElement);
    const dispatchedActions = mockStore.getActions();

    expect(dispatchedActions).toHaveLength(2);
    expect(dispatchedActions[0]).toEqual({
      type: setActiveOfferId.type,
      payload: mockOffers[0].id
    });
    expect(dispatchedActions[1]).toEqual({
      type: setActiveOfferId.type,
      payload: ''
    });
  });
});
