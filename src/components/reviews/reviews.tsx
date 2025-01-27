import useAppSelector from '../../hooks/use-app-selector';
import { AuthorizationStatus } from '../../const';
import { Reviews as ReviewsData } from '../../types/reviews';
import ReviewsList from '../reviews-list';
import ReviewForm from '../review-form';

type ReviewsProps = {
  reviews: ReviewsData;
}

function Reviews({ reviews }: ReviewsProps): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ReviewsList reviews={reviews} />

      {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm />}
    </section>
  );
}

export default Reviews;
