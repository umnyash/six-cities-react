import clsx from 'clsx';
import { useState } from 'react';
import CitiesList from '../../components/cities-list';
import Logo from '../../components/logo';
import UserNavigation from '../../components/user-navigation';
import Sorting from '../../components/sorting';
import Map from '../../components/map';
import OffersList from '../../components/offers-list';
import Spinner from '../../components/spinner';
import { SortingOption } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import { OffersListVariant } from '../../types/offers-list-variant';
import { Offers } from '../../types/offers';

function sortOffers(offers: Offers, option: SortingOption) {
  switch (option) {
    case SortingOption.PriceAsc:
      return offers.slice().sort((a, b) => a.price - b.price);
    case SortingOption.PriceDesc:
      return offers.slice().sort((a, b) => b.price - a.price);
    case SortingOption.RatingDesc:
      return offers.slice().sort((a, b) => b.rating - a.rating);
    default:
      return offers;
  }
}

function MainPage(): JSX.Element {
  const [sortingOption, setSelectedOption] = useState(SortingOption.Default);
  const [activeCardId, setActiveCardId] = useState('');

  const isOffersDataLoading = useAppSelector((state) => state.isOffersLoading);
  const offers = useAppSelector((state) => state.offers);
  const activeCity = useAppSelector((state) => state.city);
  const filteredOffers = offers.filter((offer) => offer.city.name === activeCity);
  const filteredOffersCount = filteredOffers.length;
  const filteredAndSortedOffers = sortOffers(filteredOffers, sortingOption);

  const mainClassName = clsx(
    'page__main page__main--index',
    !filteredOffersCount && 'page__main--index-empty'
  );

  const containerClassName = clsx(
    'cities__places-container container',
    !filteredOffersCount && 'cities__places-container--empty'
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
              <UserNavigation />
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
            {isOffersDataLoading && <Spinner />}

            {!isOffersDataLoading && !filteredOffersCount && (
              <section className="cities__no-places">
                <div className="cities__status-wrapper tabs__content">
                  <b className="cities__status">No places to stay available</b>
                  <p className="cities__status-description">We could not find any property available at the moment in {activeCity}</p>
                </div>
              </section>
            )}

            {!isOffersDataLoading && filteredOffersCount && (
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{filteredOffersCount} {(filteredOffersCount > 1) ? 'places' : 'place'} to stay in {activeCity}</b>
                <Sorting selectedOption={sortingOption} onOptionClick={setSelectedOption} />
                <OffersList offers={filteredAndSortedOffers} variant={OffersListVariant.Rows} setActiveCardId={setActiveCardId} />
              </section>
            )}

            <div className="cities__right-section">
              {!isOffersDataLoading && filteredOffersCount && (
                <Map
                  className="cities__map"
                  location={filteredOffers[0].city.location}
                  points={filteredOffers}
                  activePointId={activeCardId}
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
