import { Offers } from '../../types/offers';
import { OffersListVariant } from '../../types/offers-list-variant';
import OffersList from '../offers-list';
import { groupBy } from '../../util';

type FavoritesListProps = {
  offers: Offers;
}

function FavoritesList({ offers }: FavoritesListProps): JSX.Element {
  const offersGroupedByCity = groupBy(offers, (offer) => offer.city.name);
  const cities = Object.keys(offersGroupedByCity) as Array<keyof typeof offersGroupedByCity>;

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
            offers={offersGroupedByCity[city] as Offers}
            variant={OffersListVariant.Column}
          />
        </li>
      ))}
    </ul>
  );
}

export default FavoritesList;
