import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingStatus, NEARBY_OFFERS_COUNT } from '../../const';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import useArrayRandomIndices from '../../hooks/use-array-random-indices';
import { getReviews } from '../../store/reviews/reviews.selectors';
import { fetchOffer, fetchReviews, fetchNearbyOffers } from '../../store/async-actions';

import {
  getNearbyOffers, getNearbyOffersLoadingStatus,
  getOffer, getOfferLoadingStatus
} from '../../store/offers/offers.selectors';

import Offers from '../../components/offers';
import Offer from '../../components/offer';
import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';

function OfferPage(): JSX.Element {
  const offerId = useParams().id as string;
  const dispatch = useAppDispatch();

  const offer = useAppSelector(getOffer);
  const offerLoadingStatus = useAppSelector(getOfferLoadingStatus);

  useEffect(() => {
    dispatch(fetchOffer(offerId));
    dispatch(fetchReviews(offerId));
    dispatch(fetchNearbyOffers(offerId));
  }, [offerId, dispatch]);

  const reviews = useAppSelector(getReviews);

  const nearbyOffers = useAppSelector(getNearbyOffers);
  const nearbyOffersLoadingStatus = useAppSelector(getNearbyOffersLoadingStatus);

  const randomNearbyOffersIndices = useArrayRandomIndices(
    nearbyOffers.length,
    NEARBY_OFFERS_COUNT,
    nearbyOffersLoadingStatus
  );

  const randomNearbyOffers = nearbyOffers.length
    ? randomNearbyOffersIndices.map((index) => nearbyOffers[index])
    : [];

  if (offerLoadingStatus === LoadingStatus.Pending) {
    return <LoadingPage />;
  }

  if (offerLoadingStatus === LoadingStatus.Success && offer) {
    return (
      <main className="page__main page__main--offer">
        <Offer offer={offer} nearbyOffers={randomNearbyOffers} reviews={reviews} />
        <div className="container">
          <Offers heading="Other places in the neighbourhood" offers={randomNearbyOffers} />
        </div>
      </main>
    );
  }

  return <NotFoundPage />;
}

export default OfferPage;
