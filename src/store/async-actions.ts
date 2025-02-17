import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthData, AuthUser, User } from '../types/user';
import { Offers, PageOffer } from '../types/offers';
import { Reviews, Review, ReviewContent } from '../types/reviews';
import { APIRoute, NameSpace } from '../const';
import { saveToken, dropToken } from '../services/token';

type ThunkAPI = {
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

export const fetchAllOffers = createAsyncThunk<Offers, undefined, ThunkAPI>(
  `${NameSpace.Offers}/fetchAll`,
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

export const fetchOffer = createAsyncThunk<PageOffer, string, ThunkAPI>(
  `${NameSpace.Offers}/fetchOne`,
  async (offerId, { extra: api }) => {
    const apiRoute = `${APIRoute.Offers}/${offerId}`;
    const { data } = await api.get<PageOffer>(apiRoute);
    return data;
  }
);

export const fetchFavorites = createAsyncThunk<Offers, undefined, ThunkAPI>(
  `${NameSpace.Favorites}/fetch`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offers>(APIRoute.Favorites);
    return data;
  }
);

export const fetchReviews = createAsyncThunk<Reviews, string, ThunkAPI>(
  `${NameSpace.Reviews}/fetch`,
  async (offerId, { extra: api }) => {
    const apiRoute = `${APIRoute.Reviews}/${offerId}`;
    const { data } = await api.get<Reviews>(apiRoute);
    return data;
  }
);

export const sendReview = createAsyncThunk<
  Review,
  {
    offerId: string;
    content: ReviewContent;
  },
  ThunkAPI
>(
  `${NameSpace.Reviews}/send`,
  async ({ offerId, content }, { extra: api }) => {
    const apiRoute = `${APIRoute.Reviews}/${offerId}`;
    const { data } = await api.post<Review>(apiRoute, content);
    return data;
  }
);
