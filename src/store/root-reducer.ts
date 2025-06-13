import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { user } from './user/user.slice';
import { catalog } from './catalog/catalog.slice';
import { nearbyOffers } from './nearby-offers/nearby-offers.slice';
import { offer } from './offer/offer.slice';
import { favorites } from './favorites/favorites.slice';
import { reviews } from './reviews/reviews.slice';

export const rootReducer = combineReducers({
  [NameSpace.User]: user.reducer,
  [NameSpace.Catalog]: catalog.reducer,
  [NameSpace.NearbyOffers]: nearbyOffers.reducer,
  [NameSpace.Offer]: offer.reducer,
  [NameSpace.Favorites]: favorites.reducer,
  [NameSpace.Reviews]: reviews.reducer,
});
