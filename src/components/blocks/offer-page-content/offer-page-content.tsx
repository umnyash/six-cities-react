import { NEARBY_OFFERS_COUNT } from '../../../const';
import { PageOffer } from '../../../types/offers';
import { useAppSelector, useArrayRandomIndices } from '../../../hooks';
import { getNearbyOffers, getNearbyOffersLoadingStatus } from '../../../store/nearby-offers/nearby-offers.selectors';
import Offer from '../offer';
import Offers from '../offers';

type OfferPageContentProps = {
  offer: PageOffer;
}

function OfferPageContent({ offer }: OfferPageContentProps): JSX.Element {
  const nearbyOffers = useAppSelector(getNearbyOffers);
  const nearbyOffersLoadingStatus = useAppSelector(getNearbyOffersLoadingStatus);

  const randomNearbyOffersIndices = useArrayRandomIndices(
    nearbyOffers.length,
    NEARBY_OFFERS_COUNT,
    nearbyOffersLoadingStatus
  );

  const randomNearbyOffers = randomNearbyOffersIndices.map((index) => nearbyOffers[index]);

  return (
    <main className="page__main page__main--offer">
      <Offer offer={offer} nearbyOffers={randomNearbyOffers} />
      <div className="container">
        <Offers heading="Other places in the neighbourhood" offers={randomNearbyOffers} />
      </div>
    </main>
  );
}

export default OfferPageContent;
