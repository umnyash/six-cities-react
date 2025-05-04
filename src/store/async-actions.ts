import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthData, AuthUser, User } from '../types/user';
import { Offers, CardOffer, PageOffer } from '../types/offers';
import { Reviews, Review, ReviewContent } from '../types/reviews';
import { NameSpace, FavoriteStatus } from '../const';
import { apiPaths } from '../services/api';
import { saveToken, dropToken } from '../services/token';
import { omit } from '../util';

type ThunkAPI = {
  extra: AxiosInstance;
}

export const checkUserAuth = createAsyncThunk<User, undefined, ThunkAPI>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<AuthUser>(apiPaths.login());
    const user = omit(data, 'token');
    return user;
  },
);

export const loginUser = createAsyncThunk<User, AuthData, ThunkAPI>(
  `${NameSpace.User}/login`,
  async (authData, { extra: api }) => {
    const { data: { token, ...user } } = await api.post<AuthUser>(apiPaths.login(), authData);
    saveToken(token);
    return user;
  },
);

export const logoutUser = createAsyncThunk<void, undefined, ThunkAPI>(
  `${NameSpace.User}/logout`,
  async (_arg, { extra: api }) => {
    await api.delete(apiPaths.logout());
    dropToken();
  },
);

export const fetchAllOffers = createAsyncThunk<Offers, undefined, ThunkAPI>(
  `${NameSpace.Offers}/fetchAll`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offers>(apiPaths.offers());
    return data;
  },
);

export const fetchNearbyOffers = createAsyncThunk<Offers, string, ThunkAPI>(
  `${NameSpace.Offers}/fetchNearby`,
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offers>(apiPaths.nearbyOffers(offerId));
    return data;
  }
);

export const fetchOffer = createAsyncThunk<PageOffer, string, ThunkAPI>(
  `${NameSpace.Offers}/fetchOne`,
  async (offerId, { extra: api }) => {
    const { data } = await api.get<PageOffer>(apiPaths.offer(offerId));
    return data;
  }
);

export const fetchFavorites = createAsyncThunk<Offers, undefined, ThunkAPI>(
  `${NameSpace.Favorites}/fetch`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offers>(apiPaths.favorites());
    return data;
  }
);

export const changeFavoriteStatus = createAsyncThunk<
  CardOffer,
  {
    offerId: string;
    status: FavoriteStatus;
  },
  ThunkAPI
>(
  `${NameSpace.Favorites}/changeStatus`,
  async ({ offerId, status }, { extra: api }) => {
    const { data } = await api.post<CardOffer>(apiPaths.favoriteStatus(offerId, status));
    return data;
  }
);

export const fetchReviews = createAsyncThunk<Reviews, string, ThunkAPI>(
  `${NameSpace.Reviews}/fetch`,
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Reviews>(apiPaths.reviews(offerId));
    return data;
  }
);

export const submitReview = createAsyncThunk<
  Review,
  {
    offerId: string;
    content: ReviewContent;
  },
  ThunkAPI
>(
  `${NameSpace.Reviews}/submit`,
  async ({ offerId, content }, { extra: api }) => {
    const { data } = await api.post<Review>(apiPaths.reviews(offerId), content);
    return data;
  }
);
