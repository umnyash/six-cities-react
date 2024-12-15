import { useState, useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { setOffers } from '../../store/action';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import { OffersListVariant } from '../../types/offers-list-variant';
import OffersList from '../../components/offers-list';
import Logo from '../../components/logo';
import CitiesList from '../../components/cities-list';
import Map from '../../components/map';
import clsx from 'clsx';
import { offers as offersData } from '../../mocks/offers';

type MainPageProps = {
  offersCount: number;
}

function MainPage({ offersCount }: MainPageProps): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setOffers(offersData));
  }, [dispatch]);

  const offers = useAppSelector((state) => state.offers);
  const activeCity = useAppSelector((state) => state.city);
  const isEmpty = !offers.length;

  const setActiveCardId = useState('')[1];

  const mainClassName = clsx(
    'page__main page__main--index',
    isEmpty && 'page__main--index-empty'
  );

  const containerClassName = clsx(
    'cities__places-container container',
    isEmpty && 'cities__places-container--empty'
  );

  return (
    <div className="page page--gray page--main">
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

      <main className={mainClassName}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList activeCity={activeCity} />
          </section>
        </div>
        <div className="cities">
          <div className={containerClassName}>
            {isEmpty && (
              <section className="cities__no-places">
                <div className="cities__status-wrapper tabs__content">
                  <b className="cities__status">No places to stay available</b>
                  <p className="cities__status-description">We could not find any property available at the moment in Dusseldorf</p>
                </div>
              </section>
            )}

            {!isEmpty && (
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{offersCount} places to stay in Amsterdam</b>
                <form className="places__sorting" action="#" method="get">
                  <span className="places__sorting-caption">Sort by</span>{' '}
                  <span className="places__sorting-type" tabIndex={0}>
                    Popular
                    <svg className="places__sorting-arrow" width="7" height="4">
                      <use xlinkHref="#icon-arrow-select"></use>
                    </svg>
                  </span>
                  <ul className="places__options places__options--custom places__options--opened">
                    <li className="places__option places__option--active" tabIndex={0}>Popular</li>
                    <li className="places__option" tabIndex={0}>Price: low to high</li>
                    <li className="places__option" tabIndex={0}>Price: high to low</li>
                    <li className="places__option" tabIndex={0}>Top rated first</li>
                  </ul>
                </form>
                <OffersList offers={offers} variant={OffersListVariant.Rows} setActiveCardId={setActiveCardId} />
              </section>
            )}

            <div className="cities__right-section">
              {!isEmpty && (
                <Map
                  className="cities__map"
                  location={offers[0].city.location}
                  points={offers}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
