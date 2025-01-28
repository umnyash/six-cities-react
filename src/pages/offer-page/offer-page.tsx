import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { NEARBY_OFFERS_COUNT } from '../../const';
import { Reviews } from '../../types/reviews';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { fetchNearbyOffers } from '../../store/async-actions';
import { getRandomArrayItems } from '../../util';

import Logo from '../../components/logo';
import UserNavigation from '../../components/user-navigation';
import Offers from '../../components/offers';
import Offer from '../../components/offer';
import useOfferData from '../../hooks/use-offer-data';
import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';

type OfferPageProps = {
  reviews: Reviews;
}

function OfferPage({ reviews }: OfferPageProps): JSX.Element {
  const offerId = useParams().id as string;
  const dispatch = useAppDispatch();

  const offer = useOfferData(offerId);

  useEffect(() => {
    dispatch(fetchNearbyOffers(offerId));
  }, [offerId, dispatch]);

  const nearbyOffers = getRandomArrayItems(
    useAppSelector((state) => state.nearbyOffers),
    NEARBY_OFFERS_COUNT
  );

  if (offer === undefined) {
    return <LoadingPage />;
  }

  if (offer === null) {
    return <NotFoundPage />;
  }

  return (
    <div className="page">
      <Helmet>
        <title>6 cities: offer</title>
      </Helmet>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
            <nav className="header__nav">
              <UserNavigation />
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <Offer offer={offer} nearbyOffers={nearbyOffers} reviews={reviews} />
        <div className="container">
          <Offers heading="Other places in the neighbourhood" offers={nearbyOffers} />
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
