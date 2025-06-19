import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const';
import { AuthData, AuthUser, User } from '../../../types/user';
import { ThunkAPI } from '../../index';
import { apiPaths } from '../../../services/api';
import { saveToken } from '../../../services/token';

export const loginUser = createAsyncThunk<User, AuthData, ThunkAPI>(
  `${NameSpace.User}/login`,
  async (authData, { extra: api }) => {
    const { data: { token, ...user } } = await api.post<AuthUser>(apiPaths.login(), authData);
    saveToken(token);
    return user;
  },
);
