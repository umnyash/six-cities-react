import { CITIES } from '../../const';
import { getRandomArrayItem } from '../../util';
import LoginForm from '../../components/login-form';

function LoginPage(): JSX.Element {
  return (
    <main className="page__main page__main--login">
      <div className="page__login-container container">
        <section className="login">
          <h1 className="login__title">Sign in</h1>
          <LoginForm />
        </section>
        <section className="locations locations--login locations--current">
          <div className="locations__item">
            <a className="locations__item-link" href="#">
              <span>{getRandomArrayItem(CITIES)}</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
