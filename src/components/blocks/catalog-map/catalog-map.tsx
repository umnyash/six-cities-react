import { useAppSelector } from '../../../hooks';
import { getAllOffersByCity, getActiveOfferId } from '../../../store/catalog/catalog.selectors';

import Map from '../map';

function CatalogMap() {
  const offers = useAppSelector(getAllOffersByCity);
  const activeOfferId = useAppSelector(getActiveOfferId);

  return (
    <Map
      className="cities__map"
      location={offers[0].city.location}
      points={offers}
      activePointId={activeOfferId}
    />
  );
}

export default CatalogMap;
