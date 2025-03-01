import { CITIES, AppRoute } from '../../const';
import { getRandomArrayItem } from '../../util';
import { CityName } from '../../types/offers';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { setCity } from '../../store/offers/offers.slice';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/login-form';

function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const randomCityName = getRandomArrayItem(CITIES);

  const getCityButtonClickHandler = (cityName: CityName) => () => {
    dispatch(setCity(cityName));
  };

  return (
    <main className="page__main page__main--login">
      <div className="page__login-container container">
        <section className="login">
          <h1 className="login__title">Sign in</h1>
          <LoginForm />
        </section>
        <section className="locations locations--login locations--current">
          <div className="locations__item">
            <Link
              className="locations__item-link"
              to={AppRoute.Root}
              onClick={getCityButtonClickHandler(randomCityName)}
            >
              <span>{randomCityName}</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
