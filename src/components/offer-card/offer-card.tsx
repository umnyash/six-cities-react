import clsx from 'clsx';

enum OfferCardVariant {
  Default = 'default',
  Compact = 'compact',
}

type OfferCardProps = {
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

function OfferCard({ variant = OfferCardVariant.Default }: OfferCardProps): JSX.Element {
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
    <article className={cardClassName}>
      <div className="place-card__mark">
        <span>Premium</span>
      </div>
      <div className={cardImageWrapperClassName}>
        <a href="#">
          <img className="place-card__image" src="img/apartment-01.jpg" {...imageSizes[variant]} alt="Place image" />
        </a>
      </div>
      <div className={cardInfoClassName}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;120</b>{' '}
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className="place-card__bookmark-button place-card__bookmark-button--active button" type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: '80%' }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <a href="#">Beautiful &amp; luxurious apartment at great location</a>
        </h2>
        <p className="place-card__type">Apartment</p>
      </div>
    </article>
  );
}

export { OfferCardVariant };

export default OfferCard;
