import { LoadingStatus } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import { getFavorites } from '../../store/favorites/favorites.selectors';
import Favorites from '../../components/favorites';
import { getFavoritesLoadingStatus } from '../../store/favorites/favorites.selectors';
import clsx from 'clsx';
import LoadingPage from '../loading-page';

function FavoritesPage(): JSX.Element {
  const favorites = useAppSelector(getFavorites);
  const loadingStatus = useAppSelector(getFavoritesLoadingStatus);

  if (loadingStatus === LoadingStatus.Pending) {
    return <LoadingPage />;
  }

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
