import clsx from 'clsx';

import { Offers } from '../../../types/offers';
import useAppDispatch from '../../../hooks/use-app-dispatch';
import { fetchFavorites } from '../../../store/async-actions';

import FavoritesList from '../../ui/favorites-list';
import Button from '../../ui/button';

type FavoritesProps = {
  offers: Offers;
  hasError?: boolean;
}

function Favorites({ offers, hasError }: FavoritesProps): JSX.Element {
  const isEmpty = !offers.length;
  const dispatch = useAppDispatch();

  const handleLoadingButtonClick = () => {
    dispatch(fetchFavorites());
  };

  const sectionClassName = clsx(
    'favorites',
    isEmpty && 'favorites--empty'
  );

  return (
    <section className={sectionClassName}>
      {hasError && (
        <>
          <h1 className="visually-hidden">Favorites</h1>
          <div className="favorites__status-wrapper" style={{ backgroundImage: 'none' }}>
            <b className="favorites__status">Something went wrong.</b>
            <p className="favorites__status-description" style={{ padding: 0 }}>We couldn&apos;t load the offers. Please try again later.</p>
            <Button
              style={{ marginTop: '20px', minWidth: '200px' }}
              onClick={handleLoadingButtonClick}
            >
              Try again
            </Button>
          </div>
        </>
      )}

      {!hasError && !isEmpty && (
        <>
          <h1 className="favorites__title">Saved listing</h1>
          <FavoritesList offers={offers} />
        </>
      )}

      {!hasError && isEmpty && (
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
