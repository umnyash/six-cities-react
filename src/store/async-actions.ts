import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State } from '../types/state';
import { AuthData, AuthUser, User } from '../types/user';
import { Offers } from '../types/offers';
import { Reviews, Review, ReviewContent } from '../types/reviews';
import { APIRoute, NameSpace } from '../const';
import { saveToken, dropToken } from '../services/token';

import {
  setFavorites,
  setReviews,
} from './actions';

type ThunkAPI = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}

export const checkUserAuth = createAsyncThunk<User, undefined, ThunkAPI>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, { extra: api }) => {
    const { data: { name, email, avatarUrl, isPro } } = await api.get<AuthUser>(APIRoute.Login);
    return { name, email, avatarUrl, isPro };
  },
);

export const loginUser = createAsyncThunk<User, AuthData, ThunkAPI>(
  `${NameSpace.User}/login`,
  async (authData, { extra: api }) => {
    const { data: { token, ...user } } = await api.post<AuthUser>(APIRoute.Login, authData);
    saveToken(token);
    return user;
  },
);

export const logoutUser = createAsyncThunk<void, undefined, ThunkAPI>(
  `${NameSpace.User}/logout`,
  async (_arg, { extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  },
);

export const fetchOffers = createAsyncThunk<Offers, undefined, ThunkAPI>(
  `${NameSpace.Offers}/fetch`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offers>(APIRoute.Offers);
    return data;
  },
);

export const fetchNearbyOffers = createAsyncThunk<Offers, string, ThunkAPI>(
  `${NameSpace.Offers}/fetchNearby`,
  async (offerId, { extra: api }) => {
    const apiRoute = `${APIRoute.Offers}/${offerId}/nearby`;
    const { data } = await api.get<Offers>(apiRoute);
    return data;
  }
);

export const fetchFavorites = createAsyncThunk<void, undefined, ThunkAPI>(
  'favorites/fetch',
  async (_arg, { dispatch, extra: api }) => {
    const { data } = await api.get<Offers>(APIRoute.Favorites);
    dispatch(setFavorites(data));
  }
);

export const fetchReviews = createAsyncThunk<void, string, ThunkAPI>(
  'reviews/fetch',
  async (offerId, { dispatch, extra: api }) => {
    const apiRoute = `${APIRoute.Reviews}/${offerId}`;
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
    const apiRoute = `${APIRoute.Reviews}/${offerId}`;
    const { data } = await api.post<Review>(apiRoute, content);
    const reviews = getState().reviews;
    dispatch(setReviews([data, ...reviews]));
  }
);
