import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RequestStatus, NameSpace, CITIES, SortingOption } from '../../../const';
import { withStore } from '../../../tests/render-helpers';
import { setSorting } from '../../../store/catalog/catalog.slice';

import Sorting from './sorting';

describe('Component: Sorting', () => {
  const sortingOptions = Object.values(SortingOption);
  const activeSortingOption = SortingOption.Default;
  const someNotActiveSortingOption = SortingOption.RatingDesc;
  const activeSortingOptionClass = 'places__option--active';
  const openButtonTestId = 'sorting-button';

  const mockInitialState = {
    [NameSpace.Catalog]: {
      offers: [],
      loadingStatus: RequestStatus.None,
      city: CITIES[0],
      sorting: activeSortingOption,
      activeOfferId: '',
    }
  };

  it('should render correctly', () => {
    const labelText = 'Sort by';
    const { withStoreComponent } = withStore(<Sorting />, mockInitialState);

    render(withStoreComponent);
    const labelElement = screen.getByText(labelText);
    const openButtonElement = screen.getByTestId(openButtonTestId);
    const optionsListElement = screen.getByRole('list');
    const optionsElements = screen.getAllByRole('listitem');
    const activeOptionsElements = optionsElements.filter(
      (optionElement) => optionElement.classList.contains(activeSortingOptionClass)
    );

    expect(labelElement).toBeInTheDocument();
    expect(openButtonElement).toBeInTheDocument();
    expect(optionsListElement).toBeInTheDocument();
    expect(optionsElements).toHaveLength(sortingOptions.length);
    expect(screen.getByText(SortingOption.PriceDesc)).toBeInTheDocument();
    sortingOptions.forEach((option, index) => {
      expect(optionsElements[index]).toHaveTextContent(option);
    });
    expect(activeOptionsElements).toHaveLength(1);
    expect(activeOptionsElements[0]).toHaveTextContent(activeSortingOption);
  });

  it('should show options list when user click on open button and hide when user click on option', async () => {
    const expectedClass = 'places__options--opened';
    const { withStoreComponent } = withStore(<Sorting />, mockInitialState);

    render(withStoreComponent);
    const openButtonElement = screen.getByTestId(openButtonTestId);
    const optionsListElement = screen.getByRole('list');
    const optionsElements = screen.getAllByRole('listitem');

    expect(optionsListElement).not.toHaveClass(expectedClass);

    for (const optionElement of optionsElements) {
      await userEvent.click(openButtonElement);
      expect(optionsListElement).toHaveClass(expectedClass);
      await userEvent.click(optionElement);
      expect(optionsListElement).not.toHaveClass(expectedClass);
    }
  });

  it('should dispatch "setSorting" when user clicked on not active option', async () => {
    const { withStoreComponent, mockStore } = withStore(<Sorting />, mockInitialState);

    render(withStoreComponent);
    const notActiveOptionElement = screen.getByText(someNotActiveSortingOption);
    await userEvent.click(notActiveOptionElement);
    const dispatchedActions = mockStore.getActions();

    expect(dispatchedActions).toHaveLength(1);
    expect(dispatchedActions[0]).toEqual({
      type: setSorting.type,
      payload: someNotActiveSortingOption,
    });
  });

  it('should not dispatch actions when user clicked on active option', async () => {
    const { withStoreComponent, mockStore } = withStore(<Sorting />, mockInitialState);

    render(withStoreComponent);
    const optionsListElement = screen.getByRole('list');
    const activeOptionElement = within(optionsListElement).getByText(activeSortingOption);
    await userEvent.click(activeOptionElement);
    const dispatchedActions = mockStore.getActions();

    expect(dispatchedActions).toHaveLength(0);
  });
});
