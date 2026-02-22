import { Routes, Route, useLocation, Location } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { StatusCodes } from 'http-status-codes';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { APP_ROUTE_PARAM_ID, AppRoute, RequestStatus, AuthorizationStatus, NameSpace } from '../../../const';
import { State } from '../../../types/state';
import { LocationState } from '../../../types/location';
import { FavoriteStatus, apiPaths } from '../../../services/api';
import { getMockUser } from '../../../data/mocks';
import { extractActionsTypes } from '../../../tests/util';
import { withHistory, withStore } from '../../../tests/render-helpers';
import { changeFavoriteStatus } from '../../../store/async-actions';

import FavoriteButton from './favorite-button';

describe('Component: FavoriteButton', () => {
  let mockInitialState: Pick<State, NameSpace.User | NameSpace.Favorites>;

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.User]: {
        user: getMockUser(),
        authorizationStatus: AuthorizationStatus.Auth,
        loggingInStatus: RequestStatus.None,
      },
      [NameSpace.Favorites]: {
        offers: [],
        loadingStatus: RequestStatus.Success,
        changingOffersIds: [],
      },
    };
  });

  describe('link to login page', () => {
    it('should render Link component without active class when authorization status is "NO_AUTH"', () => {
      mockInitialState[NameSpace.User].authorizationStatus = AuthorizationStatus.NoAuth;
      const expectedLinkText = 'Sign in to bookmark';
      const withHistoryComponent = withHistory(<FavoriteButton offerId='some-id' />);
      const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

      render(withStoreComponent);
      const linkElement = screen.getByRole('link', { name: expectedLinkText });

      expect(linkElement).toBeInTheDocument();
      expect(linkElement).not.toHaveClass('offer__bookmark-button--active');
    });

    it('should navigate to "/login" and preserve current route in location.state.from when user clicked link', async () => {
      mockInitialState[NameSpace.User].authorizationStatus = AuthorizationStatus.NoAuth;
      const mockHistory = createMemoryHistory();
      const mockOfferRoute = AppRoute.Offer.replace(APP_ROUTE_PARAM_ID, 'some-id');
      mockHistory.push(mockOfferRoute);
      const MockLoginPage = () => {
        const location = useLocation() as Location<LocationState>;
        return (
          <div>From: {location.state?.from}</div>
        );
      };
      const withHistoryComponent = withHistory(
        <Routes>
          <Route path={AppRoute.Offer} element={<FavoriteButton offerId='some-id' />} />
          <Route path={AppRoute.Login} element={<MockLoginPage />} />
        </Routes>,
        mockHistory
      );
      const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);
      const expectedText = `From: ${mockOfferRoute}`;

      render(withStoreComponent);
      await userEvent.click(screen.getByRole('link'));

      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });

  describe('button', () => {
    const buttonText = 'Add to bookmarks';

    it.each([
      ['inactive', false],
      ['actvie', true]
    ])(
      'should render %s button when authorization status is "AUTH" and isActive prop is %s',
      (_, isActive) => {
        const withHistoryComponent = withHistory(<FavoriteButton offerId='some-id' isActive={isActive} />);
        const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

        render(withStoreComponent);
        const buttonElement = screen.getByRole('button', { name: buttonText });

        expect(buttonElement).toHaveAttribute('aria-pressed', String(isActive));
      }
    );

    it.each([
      {
        initialIsActive: false,
        targetState: 'active',
        targetIsActive: true,
      },
      {
        initialIsActive: true,
        targetState: 'inactive',
        targetIsActive: false,
      },
    ])(
      'should make button $targetState when isActive prop changes to $targetIsActive',
      ({ initialIsActive, targetIsActive }) => {
        const { rerender } = render(
          withStore(
            withHistory(<FavoriteButton offerId="some-id" isActive={initialIsActive} />), mockInitialState
          ).withStoreComponent
        );
        const buttonElement = screen.getByRole('button', { name: buttonText });
        rerender(
          withStore(
            withHistory(<FavoriteButton offerId="some-id" isActive={targetIsActive} />), mockInitialState
          ).withStoreComponent
        );

        expect(buttonElement).toHaveAttribute('aria-pressed', String(targetIsActive));
        if (targetIsActive) {
          expect(buttonElement).toHaveClass('offer__bookmark-button--active');
        } else {
          expect(buttonElement).not.toHaveClass('offer__bookmark-button--active');
        }
      }
    );

    it('should disabled button when favorite status of the corresponding offer is in the process of changing', () => {
      const mockOfferId = 'some-id';
      mockInitialState[NameSpace.Favorites].changingOffersIds = [mockOfferId];
      const withHistoryComponent = withHistory(<FavoriteButton offerId={mockOfferId} />);
      const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

      render(withStoreComponent);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should dispatch "changeFavoriteStatus" when user clicked button', async () => {
      const withHistoryComponent = withHistory(<FavoriteButton offerId="some-id" />);
      const { withStoreComponent, mockStore, mockAPIAdapter } = withStore(withHistoryComponent, mockInitialState);
      mockAPIAdapter
        .onPost(apiPaths.favoriteStatus('some-id', FavoriteStatus.On))
        .reply(StatusCodes.NOT_FOUND);

      render(withStoreComponent);
      await userEvent.click(screen.getByRole('button'));
      const actionsTypes = extractActionsTypes(mockStore.getActions());

      expect(actionsTypes).toEqual([
        changeFavoriteStatus.pending.type,
        changeFavoriteStatus.rejected.type,
      ]);
    });
  });

  describe('className prop', () => {
    const baseClassName = 'button';

    it('should have base classes when prop is missing', () => {
      const withHistoryComponent = withHistory(<FavoriteButton offerId="some-id" />);
      const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

      render(withStoreComponent);

      expect(screen.getByRole('button')).toHaveAttribute('class', baseClassName);
    });

    it('should add the passed classes to the base classes when prop is present', () => {
      const passedClassName = 'place-card__bookmark-button';
      const expectedClassAttributeValue = `${baseClassName} ${passedClassName}`;
      const withHistoryComponent = withHistory(<FavoriteButton offerId="some-id" className={passedClassName} />);
      const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

      render(withStoreComponent);

      expect(screen.getByRole('button')).toHaveClass(expectedClassAttributeValue);
    });
  });
});
