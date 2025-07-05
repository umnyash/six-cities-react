import { MemoryHistory, createMemoryHistory } from 'history';
import { screen, render } from '@testing-library/react';

import { AppRoute, RequestStatus, AuthorizationStatus, NameSpace } from '../../../const';
import { State } from '../../../types/state';
import { withHistory, withStore } from '../../../mocks/render-helpers';

import App from './app';

vi.mock('../../pages/loading-page', () => ({
  default: vi.fn(() => <h1>LoadingPage</h1>)
}));

vi.mock('../../pages/main-page', () => ({
  default: vi.fn(() => <h1>MainPage</h1>)
}));

vi.mock('../../pages/offer-page', () => ({
  default: vi.fn(() => <h1>OfferPage</h1>)
}));

vi.mock('../../pages/login-page', () => ({
  default: vi.fn(() => <h1>LoginPage</h1>)
}));

vi.mock('../../pages/favorites-page', () => ({
  default: vi.fn(() => <h1>FavoritesPage</h1>)
}));

vi.mock('../../pages/not-found-page', () => ({
  default: vi.fn(() => <h1>NotFoundPage</h1>)
}));

describe('Component: App', () => {
  let mockHistory: MemoryHistory;
  let mockInitialState: Pick<State, NameSpace.User | NameSpace.Favorites>;
  vi.spyOn(window, 'scrollTo').mockImplementation(() => { });

  beforeEach(() => {
    mockHistory = createMemoryHistory();

    mockInitialState = {
      [NameSpace.User]: {
        user: null,
        authorizationStatus: AuthorizationStatus.NoAuth,
        loggingInStatus: RequestStatus.None,
      },
      [NameSpace.Favorites]: {
        offers: [],
        loadingStatus: RequestStatus.None,
        changingOffersIds: [],
      },
    };
  });

  it.each([
    {
      pageName: 'LoadingPage',
      condition: 'authorization status is "UNKNOWN" on any route',
      authorizationStatus: AuthorizationStatus.Unknown,
    },
    {
      pageName: 'MainPage',
      route: AppRoute.Root,
      condition: 'user navigate to "/"',
    },
    {
      pageName: 'OfferPage',
      route: AppRoute.Offer,
      condition: 'user navigate to "/offer/some-offer-id"',
    },
    {
      pageName: 'LoginPage',
      route: AppRoute.Login,
      condition: 'user navigate to "/login"',
    },
    {
      pageName: 'FavoritesPage',
      route: AppRoute.Favorites,
      condition: 'user navigate to "/favorites"',
      authorizationStatus: AuthorizationStatus.Auth,
    },
    {
      pageName: 'NotFoundPage',
      route: '/unknown-route',
      condition: 'user navigate to non-existent route',
    },
  ])('should render $pageName when $condition', ({ pageName, route, authorizationStatus }) => {
    mockInitialState[NameSpace.User].authorizationStatus = authorizationStatus ?? AuthorizationStatus.NoAuth;
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);
    mockHistory.push(route ?? '/unknown-route');

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading');

    expect(headingElement).toHaveTextContent(pageName);
  });
});
