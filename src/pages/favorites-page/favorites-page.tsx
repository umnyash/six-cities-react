import useAppSelector from '../../hooks/use-app-selector';
import { getFavorites } from '../../store/favorites/favorites.selectors';
import Favorites from '../../components/favorites';
import clsx from 'clsx';

function FavoritesPage(): JSX.Element {
  const favorites = useAppSelector(getFavorites);
  const isEmpty = !favorites.length;

  const mainClassName = clsx(
    'page__main page__main--favorites',
    isEmpty && 'page__main--favorites-empty'
  );

  return (
    <main className={mainClassName}>
      <div className="page__favorites-container container">
        <Favorites offers={favorites} />
      </div>
    </main>
  );
}

export default FavoritesPage;
