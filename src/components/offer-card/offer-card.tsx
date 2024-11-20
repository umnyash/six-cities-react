import clsx from 'clsx';
import { CardOffer } from '../../types/offers';

enum OfferCardVariant {
  Default = 'default',
  Compact = 'compact',
}

type OfferCardProps = {
  offer: CardOffer;
  variant?: OfferCardVariant;
}

const imageSizes = {
  [OfferCardVariant.Default]: {
    width: 260,
    height: 200
  },
  [OfferCardVariant.Compact]: {
    width: 150,
    height: 110
  }
};

function OfferCard({ offer, variant = OfferCardVariant.Default }: OfferCardProps): JSX.Element {
  const {
    title,
    type,
    previewImage,
    rating,
    price,
    isPremium,
    isFavorite
  } = offer;

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

  const bookmarkButtonClassName = clsx(
    'place-card__bookmark-button button',
    isFavorite && 'place-card__bookmark-button--active'
  );

  return (
    <article className={cardClassName}>
      {isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}

      <div className={cardImageWrapperClassName}>
        <a href="#">
          <img className="place-card__image" src={previewImage} {...imageSizes[variant]} alt="Place image" />
        </a>
      </div>
      <div className={cardInfoClassName}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>{' '}
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={bookmarkButtonClassName} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${Math.round(rating) * 20}%` }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <a href="#">{title}</a>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export { OfferCardVariant };

export default OfferCard;
