import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State } from '../types/state';
import { AuthData, AuthUser } from '../types/user';
import { Offers } from '../types/offers';
import { APIRoute, API_ROUTE_PARAM_ID, AuthorizationStatus } from '../const';
import { setAuthorizationStatus, setUser, setOffers, setOffersLoadingStatus, setNearbyOffers } from './actions';
import { saveToken, dropToken } from '../services/token';

type ThunkAPI = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}

export const checkUserAuth = createAsyncThunk<void, undefined, ThunkAPI>(
  'user/checkAuth',
  async (_arg, { dispatch, extra: api }) => {
    try {
      await api.get(APIRoute.Login);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    } catch {
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    }
  },
);

export const loginUser = createAsyncThunk<void, AuthData, ThunkAPI>(
  'user/login',
  async (authData, { dispatch, extra: api }) => {
    const { data: { token, ...user } } = await api.post<AuthUser>(APIRoute.Login, authData);
    saveToken(token);
    dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    dispatch(setUser(user));
  },
);

export const logoutUser = createAsyncThunk<void, undefined, ThunkAPI>(
  'user/logout',
  async (_arg, { dispatch, extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    dispatch(setUser(null));
  },
);

export const fetchOffers = createAsyncThunk<void, undefined, ThunkAPI>(
  'offers/fetch',
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setOffersLoadingStatus(true));
    const { data } = await api.get<Offers>(APIRoute.Offers);
    dispatch(setOffers(data));
    dispatch(setOffersLoadingStatus(false));
  },
);

export const fetchNearbyOffers = createAsyncThunk<void, string, ThunkAPI>(
  'offers/fetchNearby',
  async (offerId, { dispatch, extra: api }) => {
    const apiRoute = APIRoute.NearbyOffers.replace(API_ROUTE_PARAM_ID, offerId);
    const { data } = await api.get<Offers>(apiRoute);
    dispatch(setNearbyOffers(data));
  }
);
