import { configureMockStore, MockStore } from '@jedmao/redux-mock-store';
import { AnyAction } from '@reduxjs/toolkit';

import { State } from '../../../types/state';
import { extractActionsTypes } from '../../../mocks/util';
import { checkUserAuth, loginUser, fetchFavorites } from '../../async-actions';

import { fetchFavoritesOnAuth } from './fetch-favorites-on-auth';

vi.mock('../../async-actions/fetch-favorites/fetch-favorites', () => ({
  fetchFavorites: vi.fn(() => ({ type: 'mockFetchFavoritesAction' }))
}));

describe('Middleware: fetchFavoritesOnAuth', () => {
  let store: MockStore;

  beforeEach(() => {
    const middleware = [fetchFavoritesOnAuth.middleware];
    const mockStoreCreator = configureMockStore<State, AnyAction>(middleware);
    store = mockStoreCreator();

    vi.clearAllMocks();
  });

  it.each([
    ['checkUserAuth.fulfilled', checkUserAuth.fulfilled.type],
    ['loginUser.fulfilled', loginUser.fulfilled.type]
  ])(
    'should dispatch fetchFavorites after %s action',
    (_action, actionType) => {
      store.dispatch({ type: actionType });

      const dispatchedActionTypes = extractActionsTypes(store.getActions());

      expect(dispatchedActionTypes).toEqual([
        actionType,
        'mockFetchFavoritesAction',
      ]);
      expect(fetchFavorites).toHaveBeenCalledOnce();
    }
  );

  it.each([
    ['checkUserAuth.pending', checkUserAuth.pending.type],
    ['checkUserAuth.rejected', checkUserAuth.rejected.type],
    ['loginUser.pending', loginUser.pending.type],
    ['loginUser.rejected', loginUser.rejected.type],
    ['someOtherAction', 'someOtherActionType']
  ])(
    'should not dispatch fetchFavorites after other actions (%s)',
    (_action, actionType) => {
      store.dispatch({ type: actionType });
      const dispatchedActionTypes = extractActionsTypes(store.getActions());

      expect(dispatchedActionTypes).toEqual([actionType]);
      expect(fetchFavorites).not.toHaveBeenCalled();
    }
  );
});
