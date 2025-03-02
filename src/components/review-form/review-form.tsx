import React, { useState, ChangeEvent, FormEvent } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { submitReview } from '../../store/async-actions';

const RATINGS = ['terribly', 'badly', 'not bad', 'good', 'perfect'];
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

  const dispatch = useAppDispatch();

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: name === 'rating' ? +value : value });
  };

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(submitReview({ offerId, content: formData }));
    setFormData({ comment: '', rating: 0 });
  };

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleFormSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {RATINGS.map((rating, index) => {
          const ratingValue = (index + 1);

          return (
            <React.Fragment key={rating}>
              <input
                className="form__rating-input visually-hidden"
                name="rating"
                value={ratingValue}
                id={`stars-${ratingValue}`}
                type="radio"
                onChange={handleFieldChange}
                checked={formData.rating === ratingValue}
              />
              <label htmlFor={`stars-${ratingValue}`} className="reviews__rating-label form__rating-label" title={rating}>
                <svg className="form__star-image" width="37" height="33">
                  <use xlinkHref="#icon-star" />
                </svg>
              </label>
            </React.Fragment>
          );
        }).reverse()}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="comment"
        name="comment"
        value={formData.comment}
        placeholder="Tell how was your stay, what you like and what can be improved"
        onChange={handleFieldChange}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span>
          and describe your stay with at least <b className="reviews__text-amount">50</b>{' '}

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
            formData.comment.length > MAX_COMMENT_LENGTH
          }
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
