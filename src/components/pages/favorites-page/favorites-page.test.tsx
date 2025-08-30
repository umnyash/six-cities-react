import { screen, render } from '@testing-library/react';

import { RequestStatus, NameSpace } from '../../../const';
import { State } from '../../../types/state';
import { getMockOffers } from '../../../data/mocks';
import { withStore } from '../../../tests/render-helpers';
import LoadingPage from '../loading-page';
import Favorites from '../../blocks/favorites';

import FavoritesPage from './favorites-page';

vi.mock('../loading-page', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../blocks/favorites', () => ({
  default: vi.fn(() => null)
}));

describe('Component: FavoritesPage', () => {
  let mockInitialState: Pick<State, NameSpace.Favorites>;

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.Favorites]: {
        offers: [],
        loadingStatus: RequestStatus.None,
        changingOffersIds: [],
      }
    };

    vi.clearAllMocks();
  });

  it('should render LoadingPage when loading status is "Pending"', () => {
    mockInitialState[NameSpace.Favorites].loadingStatus = RequestStatus.Pending;
    const { withStoreComponent } = withStore(<FavoritesPage />, mockInitialState);

    render(withStoreComponent);

    expect(LoadingPage).toHaveBeenCalled();
    expect(Favorites).not.toHaveBeenCalled();
  });

  describe('loading status is not "Pending"', () => {
    const mockOffers = getMockOffers(1);

    it.each([
      {
        condition: 'there is no favorite and loading status is "Succes"',
        loadingStatus: RequestStatus.Success,
        offers: [],
        mainClassName: 'page__main page__main--favorites page__main--favorites-empty'
      },
      {
        condition: 'favorites are present and loading status is "Succes"',
        loadingStatus: RequestStatus.Success,
        offers: mockOffers,
        mainClassName: 'page__main page__main--favorites'
      },
      {
        condition: 'there is no favorite and loading status is "Error"',
        loadingStatus: RequestStatus.Error,
        offers: [],
        mainClassName: 'page__main page__main--favorites page__main--favorites-empty'
      },
      {
        condition: 'favorites are present and loading status is "Error"',
        loadingStatus: RequestStatus.Error,
        offers: mockOffers,
        mainClassName: 'page__main page__main--favorites'
      },
    ])(
      'should render correctly when $condition',
      ({ loadingStatus, offers, mainClassName }) => {
        mockInitialState[NameSpace.Favorites].loadingStatus = loadingStatus;
        mockInitialState[NameSpace.Favorites].offers = offers;
        const { withStoreComponent } = withStore(<FavoritesPage />, mockInitialState);

        render(withStoreComponent);
        const mainElement = screen.getByRole('main');

        expect(LoadingPage).not.toHaveBeenCalled();
        expect(mainElement).toHaveAttribute('class', mainClassName);
        expect(Favorites).toHaveBeenCalledWith(
          {
            offers,
            hasError: loadingStatus === RequestStatus.Error
          },
          expect.anything()
        );
      }
    );
  });
});
