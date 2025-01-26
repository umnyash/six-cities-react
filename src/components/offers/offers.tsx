import OffersList from '../offers-list';
import { Offers as OffersData } from '../../types/offers';

type OffersProps = {
  heading: string;
  offers: OffersData;
}

function Offers({ heading, offers }: OffersProps): JSX.Element {
  return (
    <section className="near-places places">
      <h2 className="near-places__title">{heading}</h2>
      <OffersList offers={offers} />
    </section>
  );
}

export default Offers;
