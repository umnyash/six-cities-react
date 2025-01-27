import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Offers as OffersData } from '../../types/offers';
import { Reviews } from '../../types/reviews';
import Logo from '../../components/logo';
import UserNavigation from '../../components/user-navigation';
import Offers from '../../components/offers';
import Offer from '../../components/offer';
import useOfferData from '../../hooks/use-offer-data';
import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';

type OfferPageProps = {
  nearbyOffers: OffersData;
  reviews: Reviews;
}

function OfferPage({ nearbyOffers, reviews }: OfferPageProps): JSX.Element {
  const offerId = useParams().id as string;
  const offer = useOfferData(offerId);

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
          <Offers heading="Other places in the neighbourhood" offers={nearbyOffers.slice(0, 3)} />
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
