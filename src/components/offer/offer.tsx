import { PageOffer, Offers } from '../../types/offers';
import Reviews from '../reviews';
import Map from '../map';
import { capitalizeFirstLetter } from '../../util';
import FavoriteButton from '../favorite-button';
import StarsIcon, { StarsIconSize } from '../stars-icon';
import { OFFER_PHOTOS_MAX_COUNT } from '../../const';
import clsx from 'clsx';

type OfferProps = {
  offer: PageOffer;
  nearbyOffers: Offers;
}

function Offer({ offer, nearbyOffers }: OfferProps): JSX.Element {
  const {
    id,
    title,
    type,
    price,
    rating,
    isPremium,
    isFavorite,
    images,
    description,
    maxAdults,
    bedrooms,
    goods,
    host: {
      name,
      avatarUrl,
      isPro
    }
  } = offer;

  const hostAvatarWrapperClassName = clsx(
    'offer__avatar-wrapper user__avatar-wrapper',
    isPro && 'offer__avatar-wrapper--pro'
  );

  return (
    <section className="offer">
      <div className="offer__gallery-container container">
        <div className="offer__gallery">
          {images.slice(0, OFFER_PHOTOS_MAX_COUNT).map((image) => (
            <div className="offer__image-wrapper" key={image}>
              <img className="offer__image" src={image} alt="Photo studio" />
            </div>
          ))}
        </div>
      </div>
      <div className="offer__container container">
        <div className="offer__wrapper">
          {isPremium && (
            <div className="offer__mark">
              <span>Premium</span>
            </div>
          )}
          <div className="offer__name-wrapper">
            <h1 className="offer__name">{title}</h1>
            <FavoriteButton offerId={id} className="offer__bookmark-button" isActive={isFavorite} />
          </div>
          <div className="offer__rating rating">
            <StarsIcon rating={rating} size={StarsIconSize.L} />
            <span className="offer__rating-value rating__value">{rating}</span>
          </div>
          <ul className="offer__features">
            <li className="offer__feature offer__feature--entire">
              {capitalizeFirstLetter(type)}
            </li>
            <li className="offer__feature offer__feature--bedrooms">
              {bedrooms} Bedrooms
            </li>
            <li className="offer__feature offer__feature--adults">
              Max {maxAdults} adults
            </li>
          </ul>
          <div className="offer__price">
            <b className="offer__price-value">&euro;{price}</b>
            {' '}
            <span className="offer__price-text">&nbsp;night</span>
          </div>
          <div className="offer__inside">
            <h2 className="offer__inside-title">What&apos;s inside</h2>
            <ul className="offer__inside-list">
              {goods.map((good) => (
                <li className="offer__inside-item" key={good}>
                  {good}
                </li>
              ))}
            </ul>
          </div>
          <div className="offer__host">
            <h2 className="offer__host-title">Meet the host</h2>
            <div className="offer__host-user user">
              <div className={hostAvatarWrapperClassName}>
                <img className="offer__avatar user__avatar" src={avatarUrl} width="74" height="74" alt="Host avatar" />
              </div>
              <span className="offer__user-name">{name}</span>
              {isPro && <span className="offer__user-status">Pro</span>}
            </div>
            <div className="offer__description">
              <p className="offer__text">{description}</p>
            </div>
          </div>
          <Reviews offerId={id} />
        </div>
      </div>
      <Map
        className="offer__map"
        location={offer.city.location}
        points={[...nearbyOffers, offer]}
        activePointId={offer.id}
      />
    </section>
  );
}

export default Offer;
