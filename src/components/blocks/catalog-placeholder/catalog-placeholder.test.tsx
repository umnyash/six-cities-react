import { screen, render } from '@testing-library/react';

import { RequestStatus, NameSpace, CITIES, SortingOption } from '../../../const';
import { withStore } from '../../../mocks/render-helpers';

import CatalogPlaceholder from './catalog-placeholder';

describe('Component: CatalogPlaceholder', () => {
  it('should render correctly', () => {
    const activeCity = CITIES[4];
    const title = 'No places to stay available';
    const text = `We could not find any property available at the moment in ${activeCity}`;
    const mockInitialState = {
      [NameSpace.Catalog]: {
        offers: [],
        loadingStatus: RequestStatus.None,
        city: activeCity,
        sorting: SortingOption.Default,
        activeOfferId: '',
      }
    };
    const { withStoreComponent } = withStore(<CatalogPlaceholder />, mockInitialState);

    render(withStoreComponent);
    const titleElement = screen.getByText(title);
    const textElement = screen.getByText(text);

    expect(titleElement).toBeInTheDocument();
    expect(textElement).toBeInTheDocument();
  });
});
