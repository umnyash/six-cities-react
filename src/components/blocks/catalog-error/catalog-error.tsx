import { useAppDispatch } from '../../../hooks';
import { fetchAllOffers } from '../../../store/async-actions';

import Button from '../../ui/button';

function CatalogError() {
  const dispatch = useAppDispatch();

  const handleTryButtonClick = () => {
    dispatch(fetchAllOffers());
  };

  return (
    <section className="cities__no-places">
      <div className="cities__status-wrapper tabs__content">
        <b className="cities__status">Something went wrong</b>
        <p className="cities__status-description">We couldn&apos;t load the offers. Please try again later.</p>
        <Button
          style={{ marginTop: '20px', minWidth: '200px' }}
          onClick={handleTryButtonClick}
        >
          Try again
        </Button>
      </div>
    </section>
  );
}

export default CatalogError;
