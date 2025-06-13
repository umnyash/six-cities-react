import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import { RequestStatus } from '../../../const';
import useAppDispatch from '../../../hooks/use-app-dispatch';
import useAppSelector from '../../../hooks/use-app-selector';
import { getReviewSubmittingStatus } from '../../../store/reviews/reviews.selectors';
import { submitReview } from '../../../store/async-actions';

import StarsRating from '../stars-rating';

const MIN_COMMENT_LENGTH = 50;
const MAX_COMMENT_LENGTH = 300;

type ReviewFormProps = {
  offerId: string;
}

function ReviewForm({ offerId }: ReviewFormProps): JSX.Element {
  const [formData, setFormData] = useState({
    comment: '',
    rating: 0
  });

  const reviewSubmittingStatus = useAppSelector(getReviewSubmittingStatus);
  const dispatch = useAppDispatch();

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: name === 'rating' ? +value : value });
  };

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(submitReview({ offerId, content: formData }));
  };

  useEffect(() => {
    if (reviewSubmittingStatus === RequestStatus.Success) {
      setFormData({ comment: '', rating: 0 });
    }
  }, [reviewSubmittingStatus]);

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleFormSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <StarsRating
        value={formData.rating}
        onChange={handleFieldChange}
        disabled={reviewSubmittingStatus === RequestStatus.Pending}
        className="reviews__rating-form"
      />
      <textarea
        className="reviews__textarea form__textarea"
        id="comment"
        name="comment"
        value={formData.comment}
        placeholder="Tell how was your stay, what you like and what can be improved"
        disabled={reviewSubmittingStatus === RequestStatus.Pending}
        onChange={handleFieldChange}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50</b>{' '}

          {formData.comment.length > MAX_COMMENT_LENGTH && (
            <>and no more than <b className="reviews__text-amount">300</b>{' '}</>
          )}

          <b className="reviews__text-amount">characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={
            !formData.rating ||
            formData.comment.length < MIN_COMMENT_LENGTH ||
            formData.comment.length > MAX_COMMENT_LENGTH ||
            reviewSubmittingStatus === RequestStatus.Pending
          }
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
