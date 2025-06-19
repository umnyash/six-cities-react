import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const';
import { Offers } from '../../../types/offers';
import { ThunkAPI } from '../../index';
import { apiPaths } from '../../../services/api';

export const fetchAllOffers = createAsyncThunk<Offers, undefined, ThunkAPI>(
  `${NameSpace.Catalog}/fetch`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offers>(apiPaths.offers());
    return data;
  },
);
