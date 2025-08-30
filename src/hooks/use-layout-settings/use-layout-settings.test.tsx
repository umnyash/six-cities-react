import { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MemoryHistory, createMemoryHistory } from 'history';
import { renderHook } from '@testing-library/react';

import { AppRoute, PageTitle, RequestStatus, NameSpace, APP_ROUTE_PARAM_ID } from '../../const';
import { State } from '../../types/state';
import { getMockOffers } from '../../data/mocks';
import { withHistory, withStore } from '../../tests/render-helpers';

import { useLayoutSettings } from './use-layout-settings';

describe('Hook: useLayoutSettings', () => {
  let mockHistory: MemoryHistory;
  let mockInitialState: Pick<State, NameSpace.Favorites>;

  beforeEach(() => {
    mockHistory = createMemoryHistory();

    mockInitialState = {
      [NameSpace.Favorites]: {
        offers: [],
        loadingStatus: RequestStatus.None,
        changingOffersIds: [],
      }
    };
  });

  const renderWrappedHook = (path: string = '/*') => {
    mockHistory.push(path);

    const wrapper = ({ children }: { children: ReactNode }) => {
      const withHistoryComponent = withHistory(
        <Routes>
          <Route path={path} element={children}></Route>
        </Routes>,
        mockHistory
      );
      const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

      return withStoreComponent;
    };

    return renderHook(() => useLayoutSettings(), { wrapper });
  };

  it.each([
    {
      page: 'main page',
      path: AppRoute.Root,
      expected: {
        pageTitle: PageTitle.Root,
        pageClassName: 'page page--gray page--main',
        withUserNavigation: true,
        withFooter: false,
      },
    },
    {
      page: 'login page',
      path: AppRoute.Login,
      expected: {
        pageTitle: PageTitle.Login,
        pageClassName: 'page page--gray page--login',
        withUserNavigation: false,
        withFooter: false,
      },
    },
    {
      page: 'favorites page with offers',
      path: AppRoute.Favorites,
      offers: getMockOffers(1),
      expected: {
        pageTitle: PageTitle.Favorites,
        pageClassName: 'page',
        withUserNavigation: true,
        withFooter: true,
      },
    },
    {
      page: 'favorites page without offers',
      path: AppRoute.Favorites,
      expected: {
        pageTitle: PageTitle.Favorites,
        pageClassName: 'page page--favorites-empty',
        withUserNavigation: true,
        withFooter: true,
      },
    },
    {
      page: 'offer page',
      path: AppRoute.Offer.replace(APP_ROUTE_PARAM_ID, 'some-offer-id'),
      expected: {
        pageTitle: PageTitle.Offer,
        pageClassName: 'page',
        withUserNavigation: true,
        withFooter: false,
      },
    },
    {
      page: 'not found page',
      expected: {
        pageTitle: PageTitle.NotFound,
        pageClassName: 'page',
        withUserNavigation: true,
        withFooter: false,
      },
    },
  ])('should return correct settings for $page', ({ path, offers = [], expected }) => {
    mockInitialState[NameSpace.Favorites].offers = offers;
    const { result } = renderWrappedHook(path);
    expect(result.current).toEqual(expected);
  });
});
