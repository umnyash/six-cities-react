import useAppSelector from '../../hooks/use-app-selector';
import { AuthorizationStatus } from '../../const';
import { getAuthorizationStatus } from '../../store/user/user.selectors';
import { getReviews, getLatestReviews } from '../../store/reviews/reviews.selectors';
import ReviewsList from '../reviews-list';
import ReviewForm from '../review-form';

type ReviewsProps = {
  offerId: string;
}

function Reviews({ offerId }: ReviewsProps): JSX.Element {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const reviews = useAppSelector(getReviews);
  const latestReviews = useAppSelector(getLatestReviews);

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
      </h2>

      {!!reviews.length && <ReviewsList reviews={latestReviews} />}

      {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm offerId={offerId} />}
    </section>
  );
}

export default Reviews;
