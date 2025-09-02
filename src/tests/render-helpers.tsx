import { MemoryHistory, createMemoryHistory } from 'history';
import HistoryRouter from './components/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { createMockStore } from './util';
import { MockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { State } from '../types/state';
import { Provider } from 'react-redux';

type WithStoreResult = {
  withStoreComponent: JSX.Element;
  mockStore: MockStore;
  mockAPIAdapter: MockAdapter;
}

export const withStore = (component: JSX.Element, initialState: Partial<State> = {}): WithStoreResult => {
  const { mockStore, mockAPIAdapter } = createMockStore(initialState);
  const withStoreComponent = <Provider store={mockStore}>{component}</Provider>;

  return ({
    withStoreComponent,
    mockStore,
    mockAPIAdapter,
  });
};

export const withHistory = (component: JSX.Element, history: MemoryHistory = createMemoryHistory()): JSX.Element => (
  <HelmetProvider>
    <HistoryRouter history={history}>
      {component}
    </HistoryRouter>
  </HelmetProvider>
);
