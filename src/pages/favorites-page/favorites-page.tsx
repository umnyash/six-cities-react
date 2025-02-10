import { Helmet } from 'react-helmet-async';
import useAppSelector from '../../hooks/use-app-selector';
import Header from '../../components/header';
import Favorites from '../../components/favorites';
import Footer from '../../components/footer';
import clsx from 'clsx';

function FavoritesPage(): JSX.Element {
  const favorites = useAppSelector((state) => state.favorites);
  const isEmpty = !favorites.length;

  const pageClassName = clsx(
    'page',
    isEmpty && 'page--favorites-empty'
  );

  const mainClassName = clsx(
    'page__main page__main--favorites',
    isEmpty && 'page__main--favorites-empty'
  );

  return (
    <div className={pageClassName}>
      <Helmet>
        <title>6 cities: favorites</title>
      </Helmet>

      <Header withUserNavigation />

      <main className={mainClassName}>
        <div className="page__favorites-container container">
          <Favorites offers={favorites} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FavoritesPage;
