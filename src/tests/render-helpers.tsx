import { MemoryHistory, createMemoryHistory } from 'history';
import HistoryRouter from './components/history-router';
import { HelmetProvider } from 'react-helmet-async';

import { MockStore, configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { State } from '../types/state';
import { createAPI } from '../services/api';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import { AppThunkDispatch } from './types';
import { Provider } from 'react-redux';

type WithStoreResult = {
  withStoreComponent: JSX.Element;
  mockStore: MockStore;
  mockAPIAdapter: MockAdapter;
}

export const withStore = (component: JSX.Element, initialState: Partial<State> = {}): WithStoreResult => {
  const api = createAPI();
  const mockAPIAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  const mockStore = mockStoreCreator(initialState);

  return ({
    withStoreComponent: <Provider store={mockStore}>{component}</Provider>,
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
