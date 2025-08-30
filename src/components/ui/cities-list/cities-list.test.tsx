import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CITIES, RequestStatus, SortingOption, NameSpace } from '../../../const';
import { withStore } from '../../../tests/render-helpers';
import { setCity } from '../../../store/catalog/catalog.slice';

import CitiesList from './cities-list';

describe('Component: CitiesList', () => {
  const activeCity = CITIES[2];
  const notActiveCity = CITIES[5];

  const mockInitialState = {
    [NameSpace.Catalog]: {
      offers: [],
      loadingStatus: RequestStatus.None,
      city: activeCity,
      sorting: SortingOption.Default,
      activeOfferId: '',
    }
  };

  it('should render correctly', () => {
    const { withStoreComponent } = withStore(<CitiesList />, mockInitialState);

    render(withStoreComponent);
    const listElement = screen.getByRole('list');
    const actveLinkElement = screen.getByText(activeCity);
    const notActiveLinkElements = CITIES
      .filter((city) => city !== activeCity)
      .map((city) => screen.getByRole('link', { name: city }));

    expect(listElement).toBeInTheDocument();
    expect(actveLinkElement).toBeInTheDocument();
    expect(notActiveLinkElements).toHaveLength(CITIES.length - 1);
    expect(screen.queryByRole('link', { name: activeCity })).not.toBeInTheDocument();
  });

  it('should dispatch "setCity" when user clicked on not active link', async () => {
    const { withStoreComponent, mockStore } = withStore(<CitiesList />, mockInitialState);

    render(withStoreComponent);
    await userEvent.click(screen.getByText(notActiveCity));
    const dispatchedActions = mockStore.getActions();

    expect(dispatchedActions).toHaveLength(1);
    expect(dispatchedActions[0]).toEqual({
      type: setCity.type,
      payload: notActiveCity
    });
  });

  it('should not dispatch actions when user clicked on active link', async () => {
    const { withStoreComponent, mockStore } = withStore(<CitiesList />, mockInitialState);

    render(withStoreComponent);
    await userEvent.click(screen.getByText(activeCity));
    const dispatchedActions = mockStore.getActions();

    expect(dispatchedActions).toHaveLength(0);
  });
});
