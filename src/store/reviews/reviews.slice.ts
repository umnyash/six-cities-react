import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { ReviewsState } from '../../types/state';
import { fetchReviews, sendReview } from '../async-actions';

const initialState: ReviewsState = {
  reviews: [],
};

export const reviews = createSlice({
  name: NameSpace.Reviews,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.reviews = [];
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(sendReview.fulfilled, (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
      });
  },
});
