import { memo, MouseEvent } from 'react';
import clsx from 'clsx';

import { CITIES } from '../../../const';
import { CityName } from '../../../types/offers';
import useAppSelector from '../../../hooks/use-app-selector';
import useAppDispatch from '../../../hooks/use-app-dispatch';
import { getCity } from '../../../store/catalog/catalog.selectors';
import { setCity } from '../../../store/catalog/catalog.slice';

function CitiesListComponent(): JSX.Element {
  const activeCity = useAppSelector(getCity);
  const dispatch = useAppDispatch();

  const getLinkClickHandler = (cityName: CityName) => (evt: MouseEvent) => {
    evt.preventDefault();
    dispatch(setCity(cityName));
  };

  return (
    <ul className="locations__list tabs__list">
      {CITIES.map((cityName) => {
        const isActive = cityName === activeCity;

        const linkClassName = clsx(
          'locations__item-link tabs__item',
          isActive && 'tabs__item--active'
        );

        return (
          <li className="locations__item" key={cityName}>
            <a
              className={linkClassName}
              {...(!isActive && { href: '#', onClick: getLinkClickHandler(cityName) })}
            >
              <span>{cityName}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

const CitiesList = memo(CitiesListComponent);

export default CitiesList;
