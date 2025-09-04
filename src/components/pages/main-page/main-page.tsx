import { useEffect } from 'react';
import clsx from 'clsx';

import { RequestStatus } from '../../../const';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { fetchAllOffers } from '../../../store/async-actions';
import { getAllOffersLoadingStatus, getFilteredOffers } from '../../../store/catalog/catalog.selectors';

import CatalogPlaceholder from '../../blocks/catalog-placeholder';
import CatalogError from '../../blocks/catalog-error';
import CatalogMap from '../../blocks/catalog-map';
import CatalogOffers from '../../blocks/catalog-offers';
import CitiesList from '../../ui/cities-list';
import Spinner from '../../ui/spinner';

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const offersLoadingStatus = useAppSelector(getAllOffersLoadingStatus);
  const filteredOffers = useAppSelector(getFilteredOffers);
  const filteredOffersCount = filteredOffers.length;

  useEffect(() => {
    dispatch(fetchAllOffers());
  }, [dispatch]);

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
          {offersLoadingStatus === RequestStatus.Pending && (
            <Spinner />
          )}

          {offersLoadingStatus === RequestStatus.Error && (
            <CatalogError />
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
