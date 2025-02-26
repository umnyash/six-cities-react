import { useState } from 'react';
import useAppSelector from '../../hooks/use-app-selector';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { clsx } from 'clsx';
import { SortingOption } from '../../const';
import { setSorting } from '../../store/offers/offers.slice';
import { getSorting } from '../../store/offers/offers.selectors';

function Sorting(): JSX.Element {
  const selectedOption = useAppSelector(getSorting);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();

  const listClassName = clsx(
    'places__options places__options--custom',
    isOpen && 'places__options--opened'
  );

  const handleButtonClick = () => {
    setIsOpen(true);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>{' '}
      <span className="places__sorting-type" tabIndex={0} onClick={handleButtonClick}>
        {selectedOption}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className={listClassName}>
        {Object.values(SortingOption).map((option) => {
          const optionClassName = clsx(
            'places__option',
            option === selectedOption && 'places__option--active'
          );

          return (
            <li
              className={optionClassName}
              tabIndex={0}
              onClick={() => {
                dispatch(setSorting(option));
                setIsOpen(false);
              }}
              key={option}
            >
              {option}
            </li>
          );
        })}
      </ul>
    </form>
  );
}

export default Sorting;
