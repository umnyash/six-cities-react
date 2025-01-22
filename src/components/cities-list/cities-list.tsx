import useAppDispatch from '../../hooks/use-app-dispatch';
import { setCity } from '../../store/actions';
import clsx from 'clsx';
import { CityName } from '../../types/offers';
import { CITIES } from '../../const';

type CitiesListProps = {
  activeCity: CityName;
};

function CitiesList({ activeCity }: CitiesListProps): JSX.Element {
  const dispatch = useAppDispatch();

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
              {...(!isActive && { href: '#' })}
              onClick={(evt) => {
                evt.preventDefault();
                dispatch(setCity(cityName));
              }}
            >
              <span>{cityName}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default CitiesList;
