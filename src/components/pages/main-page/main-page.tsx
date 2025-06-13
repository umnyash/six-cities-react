import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { RequestStatus } from '../../../const';
import useAppDispatch from '../../../hooks/use-app-dispatch';
import useAppSelector from '../../../hooks/use-app-selector';
import { fetchAllOffers } from '../../../store/async-actions';
import {
  getAllOffersLoadingStatus,
  getCity,
  getAllOffersByCity,
  getSortedAllOffersByCity
} from '../../../store/catalog/catalog.selectors';

import Button from '../../ui/button';
import CitiesList from '../../ui/cities-list';
import Map from '../../blocks/map';
import Sorting from '../../ui/sorting';
import Spinner from '../../ui/spinner';
import OffersList, { OffersListVariant } from '../../ui/offers-list';

function MainPage(): JSX.Element {
  const [activeCardId, setActiveCardId] = useState('');
  const offersSectionElementRef = useRef<HTMLElement | null>(null);
  const dispatch = useAppDispatch();

  const offersLoadingStatus = useAppSelector(getAllOffersLoadingStatus);
  const activeCity = useAppSelector(getCity);
  const filteredOffers = useAppSelector(getAllOffersByCity);
  const filteredOffersCount = filteredOffers.length;
  const filteredAndSortedOffers = useAppSelector(getSortedAllOffersByCity);

  useEffect(() => {
    dispatch(fetchAllOffers());
  }, [dispatch]);

  useEffect(() => {
    if (offersSectionElementRef.current) {
      offersSectionElementRef.current.scrollTop = 0;
    }
  }, [activeCity]);

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
          {offersLoadingStatus === RequestStatus.Pending && <Spinner />}

          {offersLoadingStatus === RequestStatus.Error && (
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

          {offersLoadingStatus === RequestStatus.Success && !filteredOffersCount && (
            <section className="cities__no-places">
              <div className="cities__status-wrapper tabs__content">
                <b className="cities__status">No places to stay available</b>
                <p className="cities__status-description">We could not find any property available at the moment in {activeCity}</p>
              </div>
            </section>
          )}

          {offersLoadingStatus === RequestStatus.Success && filteredOffersCount && (
            <section className="cities__places places" ref={offersSectionElementRef}>
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{filteredOffersCount} {(filteredOffersCount > 1) ? 'places' : 'place'} to stay in {activeCity}</b>
              <Sorting />
              <OffersList offers={filteredAndSortedOffers} variant={OffersListVariant.Rows} setActiveCardId={setActiveCardId} />
            </section>
          )}

          <div className="cities__right-section">
            {offersLoadingStatus === RequestStatus.Success && filteredOffersCount && (
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
