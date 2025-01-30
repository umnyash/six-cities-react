import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useAppSelector from '../../hooks/use-app-selector';
import { AppRoute } from '../../const';
import Favorites from '../../components/favorites';
import Logo from '../../components/logo';
import UserNavigation from '../../components/user-navigation';

function FavoritesPage(): JSX.Element {
  const favorites = useAppSelector((state) => state.favorites);

  return (
    <div className="page">
      <Helmet>
        <title>6 cities: favorites</title>
      </Helmet>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
            <nav className="header__nav">
              <UserNavigation />
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <Favorites offers={favorites} />
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={AppRoute.Root}>
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;
