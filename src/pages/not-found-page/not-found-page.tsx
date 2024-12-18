import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppRoute } from '../../const';
import Logo from '../../components/logo';

function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <Helmet>
        <title>6 cities: page not found</title>
      </Helmet>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites" style={{ padding: '100px 20px', textAlign: 'center' }}>
            <h1 className="favorites__title">404 Not Found</h1>
            <a className="form__submit button" href="main.html">Go to Homepage</a>
          </section>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
