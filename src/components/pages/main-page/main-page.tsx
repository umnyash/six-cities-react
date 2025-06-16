import { useEffect } from 'react';
import clsx from 'clsx';

import { RequestStatus } from '../../../const';
import useAppDispatch from '../../../hooks/use-app-dispatch';
import useAppSelector from '../../../hooks/use-app-selector';
import { fetchAllOffers } from '../../../store/async-actions';
import { getAllOffersLoadingStatus, getAllOffersByCity } from '../../../store/catalog/catalog.selectors';

import Button from '../../ui/button';
import CatalogPlaceholder from '../../blocks/catalog-placeholder';
import CatalogMap from '../../blocks/catalog-map';
import CatalogOffers from '../../blocks/catalog-offers';
import CitiesList from '../../ui/cities-list';
import Spinner from '../../ui/spinner';

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const offersLoadingStatus = useAppSelector(getAllOffersLoadingStatus);
  const filteredOffers = useAppSelector(getAllOffersByCity);
  const filteredOffersCount = filteredOffers.length;

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
          <CitiesList />
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
            <CatalogPlaceholder />
          )}

          {offersLoadingStatus === RequestStatus.Success && filteredOffersCount && (
            <CatalogOffers />
          )}

          <div className="cities__right-section">
            {offersLoadingStatus === RequestStatus.Success && filteredOffersCount && (
              <CatalogMap />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainPage;
