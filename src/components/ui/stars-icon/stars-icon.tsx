import clsx from 'clsx';

import { StarsIconSize } from './const';
import { roundOffRating } from '../../../util';

type StarsIconProps = {
  rating: number;
  withHiddenValue?: boolean;
  size?: StarsIconSize;
}

function StarsIcon({ rating, withHiddenValue, size = StarsIconSize.S }: StarsIconProps): JSX.Element {
  const className = clsx(
    'rating__stars',
    size === StarsIconSize.S && 'place-card__stars',
    size === StarsIconSize.M && 'reviews__stars',
    size === StarsIconSize.L && 'offer__stars',
  );

  const ratingLabel = withHiddenValue ? `Rating: ${rating}` : 'Rating';

  return (
    <div className={className} data-testid="stars-container">
      <span style={{ width: `${roundOffRating(rating) * 20}%` }} data-testid="active-stars" />
      <span className="visually-hidden" data-testid="stars-icon-label">{ratingLabel}</span>
    </div>
  );
}

export default StarsIcon;
