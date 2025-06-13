import clsx from 'clsx';

import { RequestStatus } from '../../../const';
import useAppSelector from '../../../hooks/use-app-selector';
import { getFavorites, getFavoritesLoadingStatus } from '../../../store/favorites/favorites.selectors';

import Favorites from '../../blocks/favorites';
import LoadingPage from '../loading-page';

function FavoritesPage(): JSX.Element {
  const favorites = useAppSelector(getFavorites);
  const loadingStatus = useAppSelector(getFavoritesLoadingStatus);

  if (loadingStatus === RequestStatus.Pending) {
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
        <Favorites offers={favorites} hasError={loadingStatus === RequestStatus.Error} />
      </div>
    </main>
  );
}

export default FavoritesPage;
