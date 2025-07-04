import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { RequestStatus } from '../../../const';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { fetchOffer, fetchReviews, fetchNearbyOffers } from '../../../store/async-actions';
import { getOffer, getOfferLoadingStatus } from '../../../store/offer/offer.selectors';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import OfferPageContent from '../../blocks/offer-page-content';

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

  if (offerLoadingStatus === RequestStatus.Pending) {
    return <LoadingPage />;
  }

  if (offerLoadingStatus === RequestStatus.Success && offer) {
    return <OfferPageContent offer={offer} />;
  }

  return <NotFoundPage />;
}

export default OfferPage;
