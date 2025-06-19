import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const';
import { PageOffer } from '../../../types/offers';
import { ThunkAPI } from '../../index';
import { apiPaths } from '../../../services/api';

export const fetchOffer = createAsyncThunk<PageOffer, string, ThunkAPI>(
  `${NameSpace.Offer}/fetch`,
  async (offerId, { extra: api }) => {
    const { data } = await api.get<PageOffer>(apiPaths.offer(offerId));
    return data;
  }
);
