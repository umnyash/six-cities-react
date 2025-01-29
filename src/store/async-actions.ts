import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State } from '../types/state';
import { AuthData, AuthUser } from '../types/user';
import { Offers } from '../types/offers';
import { Reviews, Review, ReviewContent } from '../types/reviews';
import { APIRoute, API_ROUTE_PARAM_ID, AuthorizationStatus } from '../const';
import { saveToken, dropToken } from '../services/token';

import {
  setAuthorizationStatus,
  setUser,
  setOffers,
  setOffersLoadingStatus,
  setNearbyOffers,
  setReviews,
} from './actions';

type ThunkAPI = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}

export const checkUserAuth = createAsyncThunk<void, undefined, ThunkAPI>(
  'user/checkAuth',
  async (_arg, { dispatch, extra: api }) => {
    try {
      const { data: { name, email, avatarUrl, isPro } } = await api.get<AuthUser>(APIRoute.Login);
      const user = { name, email, avatarUrl, isPro };
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      dispatch(setUser(user));
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

export const fetchReviews = createAsyncThunk<void, string, ThunkAPI>(
  'reviews/fetch',
  async (offerId, { dispatch, extra: api }) => {
    const apiRoute = APIRoute.Reviews.replace(API_ROUTE_PARAM_ID, offerId);
    const { data } = await api.get<Reviews>(apiRoute);
    dispatch(setReviews(data));
  }
);

export const sendReview = createAsyncThunk<
  void,
  {
    offerId: string;
    content: ReviewContent;
  },
  ThunkAPI
>(
  'review/send',
  async ({ offerId, content }, { dispatch, getState, extra: api }) => {
    const apiRoute = APIRoute.Reviews.replace(API_ROUTE_PARAM_ID, offerId);
    const { data } = await api.post<Review>(apiRoute, content);
    const reviews = getState().reviews;
    dispatch(setReviews([data, ...reviews]));
  }
);
