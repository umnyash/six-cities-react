import { store } from '../store';
import { AuthorizationStatus } from '../const';
import { User } from './user';
import { CityName } from './offers';

export type UserState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
}

export type CatalogState = {
  city: CityName;
}

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
