import { createListenerMiddleware } from '@reduxjs/toolkit';

import { AppDispatch } from '../../../types/state';
import { checkUserAuth, loginUser, fetchFavorites } from '../../async-actions';

export const fetchFavoritesOnAuth = createListenerMiddleware();

[checkUserAuth.fulfilled, loginUser.fulfilled].forEach((actionCreator) => {
  fetchFavoritesOnAuth.startListening({
    actionCreator,
    effect: async (_action, { dispatch }) => {
      await (dispatch as AppDispatch)(fetchFavorites());
    }
  });
});
