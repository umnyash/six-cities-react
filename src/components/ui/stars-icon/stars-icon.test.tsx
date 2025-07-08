import { screen, render } from '@testing-library/react';
import { StarsIconSize } from './const';
import StarsIcon from './stars-icon';

describe('Component: StarsIcon', () => {
  it.each([
    [1, '20%'],
    [2, '40%'],
    [3, '60%'],
    [4, '80%'],
    [5, '100%']
  ])('should render correct active stars width when rating %i', (value, expectedWidth) => {
    const actviveStarsElementTestId = 'active-stars';
    render(<StarsIcon rating={value} />);
    expect(screen.getByTestId(actviveStarsElementTestId)).toHaveStyle(`width: ${expectedWidth}`);
  });

  describe('withHiddenValue prop', () => {
    const labelId = 'stars-icon-label';
    const ratingValue = 4;

    it.each([
      [`Rating: ${ratingValue}`, true],
      ['Rating', false],
    ])('should render %s value when withHiddenValue prop is %s', (text, withHiddenValue) => {
      render(<StarsIcon rating={ratingValue} withHiddenValue={withHiddenValue} />);
      const labelElement = screen.getByTestId(labelId);
      expect(labelElement).toHaveTextContent(text);
    });
  });

  it.each([
    {
      size: undefined,
      className: 'rating__stars place-card__stars',
    },
    {
      size: StarsIconSize.S,
      className: 'rating__stars place-card__stars',
    },
    {
      size: StarsIconSize.M,
      className: 'rating__stars reviews__stars',
    },
    {
      size: StarsIconSize.L,
      className: 'rating__stars offer__stars',
    },
  ])('should render stars icon with $className class when size prop is $size', ({ size, className }) => {
    const containerTestId = 'stars-container';

    render(<StarsIcon rating={5} size={size} />);
    const containerElement = screen.getByTestId(containerTestId);

    expect(containerElement).toHaveAttribute('class', className);
  });
});
