import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppRoute } from '../../const';
import Header from '../../components/header';

function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <Helmet>
        <title>6 cities: page not found</title>
      </Helmet>

      <Header withUserNavigation />

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites" style={{ padding: '100px 20px', textAlign: 'center' }}>
            <h1 className="favorites__title">404 Not Found</h1>
            <Link className="form__submit button" to={AppRoute.Root}>Go to Homepage</Link>
          </section>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
