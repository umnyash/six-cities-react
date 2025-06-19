import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const';
import { Review, ReviewContent } from '../../../types/reviews';
import { ThunkAPI } from '../../index';
import { apiPaths } from '../../../services/api';

export const submitReview = createAsyncThunk<
  Review,
  {
    offerId: string;
    content: ReviewContent;
  },
  ThunkAPI
>(
  `${NameSpace.Reviews}/submit`,
  async ({ offerId, content }, { extra: api }) => {
    const { data } = await api.post<Review>(apiPaths.reviews(offerId), content);
    return data;
  }
);
