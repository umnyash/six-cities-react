import { Fragment, ChangeEvent } from 'react';
import clsx from 'clsx';

import { RATINGS } from '../../../const';

type StarsRatingProps = {
  value: number;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

function StarsRating({ value, onChange, disabled, className }: StarsRatingProps): JSX.Element {
  const containerClassName = clsx('form__rating', className);

  return (
    <div className={containerClassName}>
      {RATINGS.map((rating, index) => {
        const ratingValue = (index + 1);

        return (
          <Fragment key={rating}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={ratingValue}
              id={`stars-${ratingValue}`}
              type="radio"
              onChange={onChange}
              checked={value === ratingValue}
              disabled={disabled}
            />
            <label htmlFor={`stars-${ratingValue}`} className="reviews__rating-label form__rating-label" title={rating}>
              <span className="visually-hidden">{rating}</span>
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star" />
              </svg>
            </label>
          </Fragment>
        );
      }).reverse()}
    </div>
  );
}

export default StarsRating;
