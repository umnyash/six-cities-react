import FavoritesList from '../favorites-list';
import { Offers } from '../../types/offers';
import clsx from 'clsx';

type FavoritesProps = {
  offers: Offers;
}

function Favorites({ offers }: FavoritesProps): JSX.Element {
  const isEmpty = !offers.length;

  const sectionClassName = clsx(
    'favorites',
    isEmpty && 'favorites--empty'
  );

  return (
    <section className={sectionClassName}>
      {!isEmpty && (
        <>
          <h1 className="favorites__title">Saved listing</h1>
          <FavoritesList offers={offers} />
        </>
      )}

      {isEmpty && (
        <>
          <h1 className="visually-hidden">Favorites (empty)</h1>
          <div className="favorites__status-wrapper">
            <b className="favorites__status">Nothing yet saved.</b>
            <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
          </div>
        </>
      )}
    </section>
  );
}

export default Favorites;
