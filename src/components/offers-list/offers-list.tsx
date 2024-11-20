import clsx from 'clsx';
import { Offers } from '../../types/offers';
import OfferCard from '../offer-card/offer-card';
import { OfferCardVariant } from '../../types/offer-card-variant';
import { OffersListVariant } from '../../types/offers-list-variant';

type OffersListProps = {
  offers: Offers;
  variant?: OffersListVariant;
}

function OffersList({ offers, variant = OffersListVariant.CenteredRows }: OffersListProps): JSX.Element {
  const listClassName = clsx(
    variant === OffersListVariant.Column && 'favorites__places',
    variant === OffersListVariant.Rows && 'cities__places-list places__list tabs__content',
    variant === OffersListVariant.CenteredRows && 'near-places__list places__list',
  );

  const cardVariant = (variant === OffersListVariant.Column)
    ? OfferCardVariant.Compact
    : OfferCardVariant.Default;

  return (
    <div className={listClassName}>
      {offers.map((offer) => <OfferCard key={offer.id} offer={offer} variant={cardVariant} />)}
    </div>
  );
}

export default OffersList;
