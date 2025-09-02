import { State } from '../types/state';
import { AppThunkDispatch } from './types';
import MockAdapter from 'axios-mock-adapter';
import { Action } from 'redux';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createAPI } from '../services/api';

export const createMockStore = (initialState: Partial<State> = {}) => {
  const api = createAPI();
  const mockAPIAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  const mockStore = mockStoreCreator(initialState);

  return {
    mockStore,
    mockAPIAdapter,
  };
};

export const extractActionsTypes = (actions: Array<Action<string>>) => actions.map(({ type }) => type);
