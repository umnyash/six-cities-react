import clsx from 'clsx';
import { useState, useEffect } from 'react';
import CitiesList from '../../components/cities-list';
import Sorting from '../../components/sorting';
import Map from '../../components/map';
import OffersList from '../../components/offers-list';
import Spinner from '../../components/spinner';
import { LoadingStatus, SortingOption } from '../../const';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { getAllOffers, getAllOffersLoadingStatus } from '../../store/offers/offers.selectors';
import { getCity, getSorting } from '../../store/catalog/catalog.selectors';
import { OffersListVariant } from '../../types/offers-list-variant';
import { Offers } from '../../types/offers';
import { fetchAllOffers } from '../../store/async-actions';
import Button from '../../components/button';

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
  const [activeCardId, setActiveCardId] = useState('');
  const dispatch = useAppDispatch();

  const offersLoadingStatus = useAppSelector(getAllOffersLoadingStatus);
  const offers = useAppSelector(getAllOffers);
  const activeCity = useAppSelector(getCity);
  const sortingOption = useAppSelector(getSorting);
  const filteredOffers = offers.filter((offer) => offer.city.name === activeCity);
  const filteredOffersCount = filteredOffers.length;
  const filteredAndSortedOffers = sortOffers(filteredOffers, sortingOption);

  useEffect(() => {
    dispatch(fetchAllOffers());
  }, [dispatch]);

  const handleLoadingButtonClick = () => {
    dispatch(fetchAllOffers());
  };

  const mainClassName = clsx(
    'page__main page__main--index',
    !filteredOffersCount && 'page__main--index-empty'
  );

  const containerClassName = clsx(
    'cities__places-container container',
    !filteredOffersCount && 'cities__places-container--empty'
  );

  return (
    <main className={mainClassName}>
      <h1 className="visually-hidden">Cities</h1>
      <div className="tabs">
        <section className="locations container">
          <CitiesList activeCity={activeCity} />
        </section>
      </div>
      <div className="cities">
        <div className={containerClassName}>
          {offersLoadingStatus === LoadingStatus.Pending && <Spinner />}

          {offersLoadingStatus === LoadingStatus.Error && (
            <section className="cities__no-places">
              <div className="cities__status-wrapper tabs__content">
                <b className="cities__status">Something went wrong</b>
                <p className="cities__status-description">We couldn&apos;t load the offers. Please try again later.</p>
                <Button
                  style={{ marginTop: '20px', minWidth: '200px' }}
                  onClick={handleLoadingButtonClick}
                >
                  Try again
                </Button>
              </div>
            </section>
          )}

          {offersLoadingStatus === LoadingStatus.Success && !filteredOffersCount && (
            <section className="cities__no-places">
              <div className="cities__status-wrapper tabs__content">
                <b className="cities__status">No places to stay available</b>
                <p className="cities__status-description">We could not find any property available at the moment in {activeCity}</p>
              </div>
            </section>
          )}

          {offersLoadingStatus === LoadingStatus.Success && filteredOffersCount && (
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{filteredOffersCount} {(filteredOffersCount > 1) ? 'places' : 'place'} to stay in {activeCity}</b>
              <Sorting selectedOption={sortingOption} />
              <OffersList offers={filteredAndSortedOffers} variant={OffersListVariant.Rows} setActiveCardId={setActiveCardId} />
            </section>
          )}

          <div className="cities__right-section">
            {offersLoadingStatus === LoadingStatus.Success && filteredOffersCount && (
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
  );
}

export default MainPage;
