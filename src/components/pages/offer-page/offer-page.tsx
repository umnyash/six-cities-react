import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { RequestStatus, NEARBY_OFFERS_COUNT } from '../../../const';
import useAppDispatch from '../../../hooks/use-app-dispatch';
import useAppSelector from '../../../hooks/use-app-selector';
import useArrayRandomIndices from '../../../hooks/use-array-random-indices';
import { fetchOffer, fetchReviews, fetchNearbyOffers } from '../../../store/async-actions';
import { getOffer, getOfferLoadingStatus } from '../../../store/offer/offer.selectors';
import { getNearbyOffers, getNearbyOffersLoadingStatus } from '../../../store/nearby-offers/nearby-offers.selectors';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import Offer from '../../blocks/offer';
import Offers from '../../blocks/offers';

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

  if (offerLoadingStatus === RequestStatus.Pending) {
    return <LoadingPage />;
  }

  if (offerLoadingStatus === RequestStatus.Success && offer) {
    return (
      <main className="page__main page__main--offer">
        <Offer offer={offer} nearbyOffers={randomNearbyOffers} />
        <div className="container">
          <Offers heading="Other places in the neighbourhood" offers={randomNearbyOffers} />
        </div>
      </main>
    );
  }

  return <NotFoundPage />;
}

export default OfferPage;
