import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { ReviewsState } from '../../types/state';
import { fetchReviews, submitReview } from '../async-actions';

const initialState: ReviewsState = {
  reviews: [],
  reviewSubmittingStatus: RequestStatus.None,
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

      .addCase(submitReview.pending, (state) => {
        state.reviewSubmittingStatus = RequestStatus.Pending;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
        state.reviewSubmittingStatus = RequestStatus.Success;
      })
      .addCase(submitReview.rejected, (state) => {
        state.reviewSubmittingStatus = RequestStatus.Error;
      });
  },
});
