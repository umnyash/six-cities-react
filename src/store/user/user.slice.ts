import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, AuthorizationStatus, RequestStatus } from '../../const';
import { UserState } from '../../types/state';
import { checkUserAuth, loginUser, logoutUser } from '../async-actions';

const initialState: UserState = {
  user: null,
  authorizationStatus: AuthorizationStatus.Unknown,
  loggingInStatus: RequestStatus.None,
};

export const user = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })

      .addCase(loginUser.pending, (state) => {
        state.loggingInStatus = RequestStatus.Pending;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.user = action.payload;
        state.loggingInStatus = RequestStatus.Success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loggingInStatus = RequestStatus.Error;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      });
  },
});
