import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';

function NotFoundPage(): JSX.Element {
  return (
    <main className="page__main page__main--favorites">
      <div className="page__favorites-container container">
        <section className="favorites" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1 className="favorites__title">404 Not Found</h1>
          <Link className="form__submit button" to={AppRoute.Root}>Go to Homepage</Link>
        </section>
      </div>
    </main>
  );
}

export default NotFoundPage;
