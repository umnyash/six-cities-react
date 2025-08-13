import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const';
import { CardOffer } from '../../../types/offers';
import { ThunkAPI } from '../../index';
import { FavoriteStatus, apiPaths } from '../../../services/api';

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
