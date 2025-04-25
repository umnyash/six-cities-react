import { StarsIconSize } from './const';
import { roundOffRating } from '../../util';
import clsx from 'clsx';

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
    <div className={className}>
      <span style={{ width: `${roundOffRating(rating) * 20}%` }} />
      <span className="visually-hidden">{ratingLabel}</span>
    </div>
  );
}

export default StarsIcon;
