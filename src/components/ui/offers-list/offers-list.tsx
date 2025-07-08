import clsx from 'clsx';

import { OffersListVariant } from './const';
import { Offers } from '../../../types/offers';

import OfferCard, { OfferCardVariant } from '../offer-card';

type OffersListProps = {
  offers: Offers;
  variant?: OffersListVariant;
  setOfferId?: (id: string) => void;
}

function OffersList(props: OffersListProps): JSX.Element {
  const {
    offers,
    variant = OffersListVariant.CenteredRows,
    setOfferId
  } = props;

  const listClassName = clsx(
    variant === OffersListVariant.Column && 'favorites__places',
    variant === OffersListVariant.Rows && 'cities__places-list places__list tabs__content',
    variant === OffersListVariant.CenteredRows && 'near-places__list places__list',
  );

  const cardVariant = (variant === OffersListVariant.Column)
    ? OfferCardVariant.Compact
    : OfferCardVariant.Default;

  return (
    <div className={listClassName} data-testid="offers-list">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          variant={cardVariant}
          setOfferId={setOfferId}
        />
      ))}
    </div>
  );
}

export default OffersList;
