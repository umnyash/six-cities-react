import { Routes, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoute, RequestStatus, NameSpace, CITIES, SortingOption } from '../../../const';
import { CityName } from '../../../types/offers';
import { withHistory, withStore } from '../../../tests/render-helpers';
import { setCity } from '../../../store/catalog/catalog.slice';
import LoginForm from '../../ui/login-form';

import LoginPage from './login-page';

vi.mock('../../ui/login-form', () => ({
  default: vi.fn(() => null)
}));

describe('Component: LoginPage', () => {
  const pageHeading = 'Sign in';

  const mockInitialState = {
    [NameSpace.Catalog]: {
      offers: [],
      loadingStatus: RequestStatus.None,
      city: CITIES[0],
      sorting: SortingOption.Default,
      activeOfferId: '',
    }
  };

  it('should render correctly', () => {
    const withHistoryComponent = withHistory(<LoginPage />);
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading', { name: pageHeading });
    const linkElement = screen.getByRole('link');

    expect(headingElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', AppRoute.Root);
    expect(LoginForm).toHaveBeenCalledOnce();
  });

  it('should render a random city name as the link text', () => {
    const renderCount = 5;
    const withHistoryComponent = withHistory(<LoginPage />);
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    for (let i = 0; i < renderCount; i++) {
      render(withStoreComponent);
    }

    const linkEementsOfAllRenderedPages = screen.getAllByRole('link');
    const cities = linkEementsOfAllRenderedPages.map((linkElement) => linkElement.textContent);
    const citiesSet = new Set(cities);

    expect(citiesSet.size).toBeGreaterThan(1);
    citiesSet.forEach((city) => {
      expect(CITIES.includes(city as CityName)).toBe(true);
    });
  });

  it('should dispatch "setCity" when user clicked on city link', async () => {
    const withHistoryComponent = withHistory(<LoginPage />);
    const { withStoreComponent, mockStore } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);
    const link = screen.getByRole('link');
    await userEvent.click(link);
    const dispatchedActions = mockStore.getActions();

    expect(dispatchedActions).toHaveLength(1);
    expect(dispatchedActions[0]).toEqual({
      type: setCity.type,
      payload: link.textContent
    });
  });

  it('should redirect to "/" when user clicked on city link', async () => {
    const mainPageMockHeading = 'Main Page';
    const mockHistory = createMemoryHistory();
    mockHistory.push(AppRoute.Login);
    const withHistoryComponent = withHistory(
      <Routes>
        <Route path={AppRoute.Root} element={<h1>{mainPageMockHeading}</h1>} />
        <Route path={AppRoute.Login} element={<LoginPage />} />
      </Routes>,
      mockHistory
    );
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);
    const loginPageHeadingElement = screen.getByRole('heading', { name: pageHeading });
    const link = screen.getByRole('link');

    expect(loginPageHeadingElement).toBeInTheDocument();

    await userEvent.click(link);
    expect(screen.getByRole('heading', { name: mainPageMockHeading })).toBeInTheDocument();
  });
});
