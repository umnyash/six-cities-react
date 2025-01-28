import { PageOffer, Offers } from '../../types/offers';
import { Reviews as ReviewsData } from '../../types/reviews';
import Reviews from '../reviews';
import Map from '../map';
import clsx from 'clsx';
import { roundOffRating, capitalizeFirstLetter } from '../../util';

type OfferProps = {
  offer: PageOffer;
  nearbyOffers: Offers;
  reviews: ReviewsData;
}

function Offer({ offer, nearbyOffers, reviews }: OfferProps): JSX.Element {
  const {
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

  const bookmarkButtonClassName = clsx(
    'offer__bookmark-button button',
    isFavorite && 'offer__bookmark-button--active'
  );

  return (
    <section className="offer">
      <div className="offer__gallery-container container">
        <div className="offer__gallery">
          {images.map((image) => (
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
            <button className={bookmarkButtonClassName} type="button">
              <svg className="offer__bookmark-icon" width="31" height="33">
                <use xlinkHref="#icon-bookmark"></use>
              </svg>
              <span className="visually-hidden">To bookmarks</span>
            </button>
          </div>
          <div className="offer__rating rating">
            <div className="offer__stars rating__stars">
              <span style={{ width: `${roundOffRating(rating) * 20}%` }}></span>
              <span className="visually-hidden">Rating</span>
            </div>
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
              <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                <img className="offer__avatar user__avatar" src={avatarUrl} width="74" height="74" alt="Host avatar" />
              </div>
              <span className="offer__user-name">{name}</span>
              {isPro && <span className="offer__user-status">Pro</span>}
            </div>
            <div className="offer__description">
              <p className="offer__text">{description}</p>
            </div>
          </div>
          <Reviews reviews={reviews} />
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
