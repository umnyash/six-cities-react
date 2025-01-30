import FavoritesList from '../favorites-list';
import { Offers } from '../../types/offers';

type FavoritesProps = {
  offers: Offers;
}

function Favorites({ offers }: FavoritesProps): JSX.Element {
  return (
    <section className="favorites">
      <h1 className="favorites__title">Saved listing</h1>
      <FavoritesList offers={offers} />
    </section>
  );
}

export default Favorites;
