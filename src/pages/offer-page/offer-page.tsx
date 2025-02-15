import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NEARBY_OFFERS_COUNT } from '../../const';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { getNearbyOffers } from '../../store/offers/offers.selectors';
import { getReviews } from '../../store/reviews/reviews.selectors';
import { fetchReviews, fetchNearbyOffers } from '../../store/async-actions';
import { getRandomArrayItems } from '../../util';

import Offers from '../../components/offers';
import Offer from '../../components/offer';
import useOfferData from '../../hooks/use-offer-data';
import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';

function OfferPage(): JSX.Element {
  const offerId = useParams().id as string;
  const dispatch = useAppDispatch();

  const offer = useOfferData(offerId);

  useEffect(() => {
    dispatch(fetchReviews(offerId));
    dispatch(fetchNearbyOffers(offerId));
  }, [offerId, dispatch]);

  const reviews = useAppSelector(getReviews);

  const nearbyOffers = getRandomArrayItems(
    useAppSelector(getNearbyOffers),
    NEARBY_OFFERS_COUNT
  );

  if (offer === undefined) {
    return <LoadingPage />;
  }

  if (offer === null) {
    return <NotFoundPage />;
  }

  return (
    <main className="page__main page__main--offer">
      <Offer offer={offer} nearbyOffers={nearbyOffers} reviews={reviews} />
      <div className="container">
        <Offers heading="Other places in the neighbourhood" offers={nearbyOffers} />
      </div>
    </main>
  );
}

export default OfferPage;
