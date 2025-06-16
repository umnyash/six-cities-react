import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import { RequestStatus, ReviewCommentLength } from '../../../const';
import useAppDispatch from '../../../hooks/use-app-dispatch';
import useAppSelector from '../../../hooks/use-app-selector';
import { getReviewSubmittingStatus } from '../../../store/reviews/reviews.selectors';
import { submitReview } from '../../../store/async-actions';

import StarsRating from '../stars-rating';

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
      <label className="reviews__label form__label" htmlFor="comment">Your review</label>
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
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{ReviewCommentLength.Min}</b>{' '}

          {formData.comment.length > ReviewCommentLength.Max && (
            <>and no more than <b className="reviews__text-amount">{ReviewCommentLength.Max}</b>{' '}</>
          )}

          <b className="reviews__text-amount">characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={
            !formData.rating ||
            formData.comment.length < ReviewCommentLength.Min ||
            formData.comment.length > ReviewCommentLength.Max ||
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
