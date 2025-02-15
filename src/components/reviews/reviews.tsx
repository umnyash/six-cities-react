import useAppSelector from '../../hooks/use-app-selector';
import { AuthorizationStatus } from '../../const';
import { Reviews as ReviewsData } from '../../types/reviews';
import { REVIEWS_MAX_COUNT } from '../../const';
import { getAuthorizationStatus } from '../../store/user/user.selectors';
import ReviewsList from '../reviews-list';
import ReviewForm from '../review-form';

type ReviewsProps = {
  offerId: string;
  reviews: ReviewsData;
}

function getLatestReviews(reviews: ReviewsData) {
  return reviews
    .toSorted((a, b) => (a.date < b.date) ? 1 : -1)
    .slice(0, REVIEWS_MAX_COUNT);
}

function Reviews({ offerId, reviews }: ReviewsProps): JSX.Element {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const latestReviews = getLatestReviews(reviews);

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ReviewsList reviews={latestReviews} />

      {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm offerId={offerId} />}
    </section>
  );
}

export default Reviews;
