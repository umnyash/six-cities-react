import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const';
import { Offers } from '../../../types/offers';
import { ThunkAPI } from '../../index';
import { apiPaths } from '../../../services/api';

export const fetchNearbyOffers = createAsyncThunk<Offers, string, ThunkAPI>(
  `${NameSpace.NearbyOffers}/fetch`,
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offers>(apiPaths.nearbyOffers(offerId));
    return data;
  }
);
