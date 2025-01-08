import { useState } from 'react';
import { clsx } from 'clsx';
import { SortingOption } from '../../const';

type SortingProps = {
  selectedOption: SortingOption;
}

function Sorting({ selectedOption }: SortingProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

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
        Popular
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
