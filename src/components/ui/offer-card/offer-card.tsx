import { memo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { AppRoute, APP_ROUTE_PARAM_ID } from '../../../const';
import { OfferCardVariant } from './const';
import { CardOffer } from '../../../types/offers';

import FavoriteButton from '../favorite-button';
import StarsIcon from '../stars-icon';

type OfferCardProps = {
  offer: CardOffer;
  variant?: OfferCardVariant;
  setActiveCardId?: (id: string) => void;
}

const imageSizes = {
  [OfferCardVariant.Default]: {
    width: 260,
    height: 200
  },
  [OfferCardVariant.Compact]: {
    width: 150,
    height: 110,
    style: {
      maxHeight: '110px',
      objectFit: 'cover' as React.CSSProperties['objectFit'],
      objectPosition: 'center' as React.CSSProperties['objectPosition'],
    }
  }
};

function OfferCardComponent(props: OfferCardProps): JSX.Element {
  const {
    offer,
    variant = OfferCardVariant.Default,
    setActiveCardId
  } = props;

  const {
    id,
    title,
    type,
    previewImage,
    rating,
    price,
    isPremium,
    isFavorite
  } = offer;

  const link = AppRoute.Offer.replace(APP_ROUTE_PARAM_ID, id);

  const handleCardMouseOver = setActiveCardId && (() => setActiveCardId(id));
  const handleCardMouseOut = setActiveCardId && (() => setActiveCardId(''));

  const cardClassName = clsx(
    'place-card',
    variant === OfferCardVariant.Default && 'cities__card',
    variant === OfferCardVariant.Compact && 'favorites__card'
  );

  const cardImageWrapperClassName = clsx(
    'place-card__image-wrapper',
    variant === OfferCardVariant.Compact && 'favorites__image-wrapper'
  );

  const cardInfoClassName = clsx(
    'place-card__info',
    variant === OfferCardVariant.Compact && 'favorites__card-info'
  );

  return (
    <article
      className={cardClassName}
      onMouseOver={handleCardMouseOver}
      onMouseOut={handleCardMouseOut}
    >
      {isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}

      <div className={cardImageWrapperClassName}>
        <Link to={link}>
          <img className="place-card__image" src={previewImage} {...imageSizes[variant]} alt="Place image" />
        </Link>
      </div>
      <div className={cardInfoClassName}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>{' '}
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <FavoriteButton offerId={id} className="place-card__bookmark-button" isActive={isFavorite} />
        </div>
        <div className="place-card__rating rating">
          <StarsIcon rating={rating} withHiddenValue />
        </div>
        <h2 className="place-card__name">
          <Link to={link}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

const OfferCard = memo(OfferCardComponent);

export default OfferCard;
