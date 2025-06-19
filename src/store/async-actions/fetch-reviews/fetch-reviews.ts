import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const';
import { Reviews } from '../../../types/reviews';
import { ThunkAPI } from '../../index';
import { apiPaths } from '../../../services/api';

export const fetchReviews = createAsyncThunk<Reviews, string, ThunkAPI>(
  `${NameSpace.Reviews}/fetch`,
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Reviews>(apiPaths.reviews(offerId));
    return data;
  }
);
