import { Reviews } from '../../../types/reviews';
import ReviewsItem from '../reviews-item';

type ReviewsListProps = {
  reviews: Reviews;
}

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  return (
    <ul className="reviews__list">
      {reviews.map((review) => <ReviewsItem review={review} key={review.id} />)}
    </ul>
  );
}

export default ReviewsList;
