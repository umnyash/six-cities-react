import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusCodes } from 'http-status-codes';

import { apiPaths } from '../../../services/api';
import { Offers } from '../../../types/offers';
import { getMockOffers } from '../../../data/mocks';
import { extractActionsTypes } from '../../../tests/util';
import { withStore } from '../../../tests/render-helpers';
import { fetchFavorites } from '../../../store/async-actions';
import FavoritesList from '../../ui/favorites-list';

import Favorites from './favorites';

vi.mock('../../ui/favorites-list', () => ({
  default: vi.fn(() => null)
}));

describe('Component: Favorites', () => {
  it('should render correctly when there are featured offers', () => {
    const mockOffers = getMockOffers(1);
    const heading = 'Saved listing';
    const { withStoreComponent } = withStore(<Favorites offers={mockOffers} />);

    render(withStoreComponent);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    expect(FavoritesList).toHaveBeenCalledWith(
      { offers: mockOffers },
      expect.anything()
    );
  });

  it('should render correctly when there are no featured offers', () => {
    const mockOffers: Offers = [];
    const heading = 'Favorites (empty)';
    const expectedText = 'Nothing yet saved.';
    const { withStoreComponent } = withStore(<Favorites offers={mockOffers} />);

    render(withStoreComponent);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('should render correctly if there is an error loading data', () => {
    const mockOffers: Offers = [];
    const heading = 'Favorites';
    const errorText = 'Something went wrong.';
    const { withStoreComponent } = withStore(<Favorites offers={mockOffers} hasError />);

    render(withStoreComponent);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    expect(screen.getByText(errorText)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('should dispatch "fetchOffers" when user clicked retry button', async () => {
    const mockOffers: Offers = [];
    const { withStoreComponent, mockStore, mockAPIAdapter } = withStore(<Favorites offers={mockOffers} hasError />);
    mockAPIAdapter.onGet(apiPaths.favorites()).reply(StatusCodes.OK, mockOffers);

    render(withStoreComponent);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      fetchFavorites.pending.type,
      fetchFavorites.fulfilled.type,
    ]);
  });

  it('should render correctly after successful retry', async () => {
    const mockOffers = getMockOffers(1);
    const heading = 'Saved listing';

    const { rerender } = render(withStore(<Favorites offers={[]} hasError />).withStoreComponent);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    rerender(withStore(<Favorites offers={mockOffers} />).withStoreComponent);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    expect(FavoritesList).toHaveBeenCalledWith(
      { offers: mockOffers },
      expect.anything()
    );
  });
});
