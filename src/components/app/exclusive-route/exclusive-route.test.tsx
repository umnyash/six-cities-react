import { Routes, Route } from 'react-router-dom';
import { MemoryHistory, createMemoryHistory } from 'history';
import { screen, render } from '@testing-library/react';

import { AppRoute, RequestStatus, AuthorizationStatus, NameSpace } from '../../../const';
import { State } from '../../../types/state';
import { withHistory, withStore } from '../../../tests/render-helpers';

import ExclusiveRoute from './exclusive-route';

describe('Component: ExclusiveRoute', () => {
  const mockPageHeadings = {
    [AppRoute.Root]: 'Main Page',
    [AppRoute.Login]: 'Login Page',
    [AppRoute.Favorites]: 'Favorites Page',
  };

  let mockHistory: MemoryHistory;
  let mockInitialState: Pick<State, NameSpace.User>;

  beforeAll(() => {
    mockHistory = createMemoryHistory();
  });

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.User]: {
        user: null,
        authorizationStatus: AuthorizationStatus.Unknown,
        loggingInStatus: RequestStatus.None,
      }
    };
  });

  it.each([
    {
      case: 'should render it when target route is exclusive to "AUTH" users and authorization status is "AUTH"',
      authorizationStatus: AuthorizationStatus.Auth,
      targetRoute: AppRoute.Favorites,
      expectedPageHeading: mockPageHeadings[AppRoute.Favorites],
    },
    {
      case: 'should redirect to "/login" when target route is exclusive to "AUTH" users and authorization status is "NO_AUTH"',
      authorizationStatus: AuthorizationStatus.NoAuth,
      targetRoute: AppRoute.Favorites,
      expectedPageHeading: mockPageHeadings[AppRoute.Login],
    },
    {
      case: 'should render it when target route is exclusive to "NO_AUTH" users and authorization status is "NO_AUTH"',
      authorizationStatus: AuthorizationStatus.NoAuth,
      targetRoute: AppRoute.Login,
      expectedPageHeading: mockPageHeadings[AppRoute.Login],
    },
    {
      case: 'should redirect to "/" when target route is exclusive to "NO_AUTH" users, authorization status is "AUTH" and there is no previous page',
      authorizationStatus: AuthorizationStatus.Auth,
      targetRoute: AppRoute.Login,
      expectedPageHeading: mockPageHeadings[AppRoute.Root],
    },
    {
      case: 'should redirect to "/favorites" when target route is exclusive to "NO_AUTH" users, authorization status is "AUTH" and there is a previous page',
      authorizationStatus: AuthorizationStatus.Auth,
      targetRoute: AppRoute.Login,
      previousPageRoute: AppRoute.Favorites,
      expectedPageHeading: mockPageHeadings[AppRoute.Favorites],
    }
  ])('$case', ({ authorizationStatus, targetRoute, previousPageRoute, expectedPageHeading }) => {
    mockHistory.push(targetRoute, { from: previousPageRoute });
    const withHistoryComponent = withHistory(
      <Routes>
        <Route path={AppRoute.Root} element={<h1>{mockPageHeadings[AppRoute.Root]}</h1>} />
        <Route path={AppRoute.Login} element={
          <ExclusiveRoute onlyFor={AuthorizationStatus.NoAuth}>
            <h1>{mockPageHeadings[AppRoute.Login]}</h1>
          </ExclusiveRoute>
        }
        />
        <Route path={AppRoute.Favorites} element={
          <ExclusiveRoute onlyFor={AuthorizationStatus.Auth}>
            <h1>{mockPageHeadings[AppRoute.Favorites]}</h1>
          </ExclusiveRoute>
        }
        />
      </Routes>,
      mockHistory
    );
    mockInitialState[NameSpace.User].authorizationStatus = authorizationStatus;
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading');

    expect(headingElement).toHaveTextContent(expectedPageHeading);
  });
});
