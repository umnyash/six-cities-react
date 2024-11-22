import React, { useState, ChangeEvent } from 'react';

const RATINGS = ['terribly', 'badly', 'not bad', 'good', 'perfect'];
const MIN_COMMENT_LENGTH = 50;

function ReviewForm(): JSX.Element {
  const [formData, setFormData] = useState({
    comment: '',
    rating: 0
  });

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: name === 'rating' ? +value : value });
  };

  return (
    <form className="reviews__form form" action="#" method="post">
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
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={Boolean(!formData.rating || formData.comment.length < MIN_COMMENT_LENGTH)}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
