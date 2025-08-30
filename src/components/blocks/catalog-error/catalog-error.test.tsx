import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusCodes } from 'http-status-codes';

import { apiPaths } from '../../../services/api';
import { getMockOffers } from '../../../data/mocks';
import { extractActionsTypes } from '../../../tests/util';
import { withStore } from '../../../tests/render-helpers';
import { fetchAllOffers } from '../../../store/async-actions';

import CatalogError from './catalog-error';

describe('Component: CatalogError', () => {
  const errorTitle = 'Something went wrong';
  const retryButtonText = 'Try again';

  it('should render correctly', () => {
    const { withStoreComponent } = withStore(<CatalogError />);

    render(withStoreComponent);
    const errorTitleElement = screen.getByText(errorTitle);
    const retryButtonElement = screen.getByRole('button', { name: retryButtonText });

    expect(errorTitleElement).toBeInTheDocument();
    expect(retryButtonElement).toBeInTheDocument();
  });

  it('should dispatch "fetchAllOffers" action when user clicked on retry button', async () => {
    const mockOffers = getMockOffers(2);
    const { withStoreComponent, mockStore, mockAPIAdapter } = withStore(<CatalogError />);
    mockAPIAdapter.onGet(apiPaths.offers()).reply(StatusCodes.OK, mockOffers);

    render(withStoreComponent);
    const retryButtonElement = screen.getByRole('button', { name: retryButtonText });
    await userEvent.click(retryButtonElement);
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      fetchAllOffers.pending.type,
      fetchAllOffers.fulfilled.type,
    ]);
  });
});
