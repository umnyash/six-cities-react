import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusCodes } from 'http-status-codes';

import { RequestStatus, AuthorizationStatus, NameSpace } from '../../../const';
import { State } from '../../../types/state';
import { apiPaths } from '../../../services/api';
import { getMockUser, getMockOffers } from '../../../mocks/data';
import { extractActionsTypes } from '../../../mocks/util';
import { withHistory, withStore } from '../../../mocks/render-helpers';
import { logoutUser } from '../../../store/async-actions';

import UserNavigation from './user-navigation';

describe('Component: UserNavigation', () => {
  const loginLinkText = 'Sign in';
  const logoutLinkText = 'Sign out';
  let mockInitialState: Pick<State, NameSpace.User | NameSpace.Favorites>;

  beforeEach(() => {
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

  it('should render correctly when authorization status is "NO_AUTH"', () => {
    const expectedLinksCount = 1;

    const withHistoryComponent = withHistory(<UserNavigation />);
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(expectedLinksCount);
    expect(screen.getByRole('link', { name: loginLinkText }));
  });

  it('should render correctly when authorization status is "AUTH" and there is user data', () => {
    const mockUser = getMockUser();
    const mockFavorites = getMockOffers(2, { isFavorite: true });
    const expectedLinksCount = 2;
    const expectedFavoritesLinkText = `${mockUser.email} ${mockFavorites.length}`;
    mockInitialState[NameSpace.User].user = mockUser;
    mockInitialState[NameSpace.User].authorizationStatus = AuthorizationStatus.Auth;
    mockInitialState[NameSpace.Favorites].offers = mockFavorites;
    mockInitialState[NameSpace.Favorites].loadingStatus = RequestStatus.Success;
    const withHistoryComponent = withHistory(<UserNavigation />);
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(expectedLinksCount);
    expect(screen.getByRole('link', { name: expectedFavoritesLinkText }));
    expect(screen.getByRole('link', { name: logoutLinkText }));
  });

  it('should dispatch "logoutUser" when user clicked logout link', async () => {
    mockInitialState[NameSpace.User].user = getMockUser();
    mockInitialState[NameSpace.User].authorizationStatus = AuthorizationStatus.Auth;
    mockInitialState[NameSpace.Favorites].offers = [];
    mockInitialState[NameSpace.Favorites].loadingStatus = RequestStatus.Success;
    const withHistoryComponent = withHistory(<UserNavigation />);
    const { withStoreComponent, mockStore, mockAPIAdapter } = withStore(withHistoryComponent, mockInitialState);
    mockAPIAdapter.onDelete(apiPaths.logout()).reply(StatusCodes.NO_CONTENT);

    render(withStoreComponent);
    const logoutLink = screen.getByRole('link', { name: logoutLinkText });
    await userEvent.click(logoutLink);
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      logoutUser.pending.type,
      logoutUser.fulfilled.type,
    ]);
  });
});
