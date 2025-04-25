import { Review } from '../../types/reviews';
import StarsIcon, { StarsIconSize } from '../stars-icon';

type ReviewsItemProps = {
  review: Review;
}

function ReviewsItem({ review }: ReviewsItemProps): JSX.Element {
  const { date, user: { name, avatarUrl }, comment, rating } = review;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img className="reviews__avatar user__avatar" src={avatarUrl} width="54" height="54" alt="Reviews avatar" />
        </div>
        <span className="reviews__user-name">
          {name}
        </span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <StarsIcon rating={rating} size={StarsIconSize.M} withHiddenValue />
        </div>
        <p className="reviews__text">{comment}</p>
        <time className="reviews__time" dateTime={date}>{formattedDate}</time>
      </div>
    </li>
  );
}

export default ReviewsItem;
