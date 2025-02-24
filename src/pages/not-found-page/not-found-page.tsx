import { AppRoute } from '../../const';
import Button from '../../components/button';
import { ButtonType } from '../../types/button';

function NotFoundPage(): JSX.Element {
  return (
    <main className="page__main page__main--favorites">
      <div className="page__favorites-container container">
        <section className="favorites" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1 className="favorites__title">404 Not Found</h1>
          <Button type={ButtonType.Route} to={AppRoute.Root}>Go to Homepage</Button>
        </section>
      </div>
    </main>
  );
}

export default NotFoundPage;
