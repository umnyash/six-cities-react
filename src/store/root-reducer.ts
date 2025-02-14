import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { user } from './user/user.slice';
import { offers } from './offers/offers.slice';
import { favorites } from './favorites/favorites.slice';
import { reviews } from './reviews/reviews.slice';
import { catalog } from './catalog/catalog.slice';

export const rootReducer = combineReducers({
  [NameSpace.User]: user.reducer,
  [NameSpace.Offers]: offers.reducer,
  [NameSpace.Favorites]: favorites.reducer,
  [NameSpace.Reviews]: reviews.reducer,
  [NameSpace.Catalog]: catalog.reducer,
});
