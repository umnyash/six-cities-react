import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const';
import { AuthUser, User } from '../../../types/user';
import { ThunkAPI } from '../../index';
import { apiPaths } from '../../../services/api';
import { omit } from '../../../util';

export const checkUserAuth = createAsyncThunk<User, undefined, ThunkAPI>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<AuthUser>(apiPaths.login());
    const user = omit(data, 'token');
    return user;
  },
);
