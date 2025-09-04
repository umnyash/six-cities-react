import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getCityFilter, getSortedAllOffersByCity, getSorting } from '../../../store/catalog/catalog.selectors';
import { setActiveOfferId } from '../../../store/catalog/catalog.slice';

import Sorting from '../../ui/sorting';
import OffersList, { OffersListVariant } from '../../ui/offers-list';

function CatalogOffers(): JSX.Element {
  const offersSectionElementRef = useRef<HTMLElement | null>(null);
  const activeCity = useAppSelector(getCityFilter);
  const sorting = useAppSelector(getSorting);
  const dispatch = useAppDispatch();

  const offers = useAppSelector(getSortedAllOffersByCity);

  useEffect(() => {
    if (offersSectionElementRef.current) {
      offersSectionElementRef.current.scrollTop = 0;
    }
  }, [activeCity, sorting]);

  const setCatalogActiveOfferId = (id: string) => {
    dispatch(setActiveOfferId(id));
  };

  return (
    <section className="cities__places places" ref={offersSectionElementRef}>
      <h2 className="visually-hidden">Places</h2>
      <b className="places__found">{offers.length} {(offers.length > 1) ? 'places' : 'place'} to stay in {activeCity}</b>
      <Sorting />
      <OffersList offers={offers} variant={OffersListVariant.Rows} setOfferId={setCatalogActiveOfferId} />
    </section>
  );
}

export default CatalogOffers;
