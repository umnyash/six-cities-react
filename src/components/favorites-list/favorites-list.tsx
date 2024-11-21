import { Offers } from '../../types/offers';
import { OffersListVariant } from '../../types/offers-list-variant';
import OffersList from '../offers-list';

type FavoritesListProps = {
  offers: Offers;
}

function FavoritesList({ offers }: FavoritesListProps): JSX.Element {
  const cities = Array.from(new Set(offers.map((offer) => offer.city.name)));

  return (
    <ul className="favorites__list">
      {cities.map((city) => (
        <li className="favorites__locations-items" key={city}>
          <div className="favorites__locations locations locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>{city}</span>
              </a>
            </div>
          </div>
          <OffersList
            offers={offers.filter((offer) => offer.city.name === city)}
            variant={OffersListVariant.Column}
          />
        </li>
      ))}
    </ul>
  );
}

export default FavoritesList;
