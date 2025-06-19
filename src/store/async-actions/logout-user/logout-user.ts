import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const';
import { ThunkAPI } from '../../index';
import { apiPaths } from '../../../services/api';
import { dropToken } from '../../../services/token';

export const logoutUser = createAsyncThunk<void, undefined, ThunkAPI>(
  `${NameSpace.User}/logout`,
  async (_arg, { extra: api }) => {
    await api.delete(apiPaths.logout());
    dropToken();
  },
);
