import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RATINGS } from '../../../const';

import StarsRating from './stars-rating';

describe('Component: StarsRating', () => {
  const containerElementTestId = 'stars-rating';

  it('should render correctly', () => {
    const inputAndLabelsCount = 10;

    render(
      <StarsRating
        value={0}
        onChange={vi.fn()}
      />
    );
    const containerElement = screen.getByTestId(containerElementTestId);

    expect(containerElement).toBeInTheDocument();
    expect(containerElement.children).toHaveLength(inputAndLabelsCount);
    RATINGS.forEach((rating, index) => {
      expect(screen.getByLabelText(rating)).toBeInTheDocument();
      const radiobutton: HTMLInputElement = screen.getByRole('radio', { name: rating });
      expect(radiobutton).toBeInTheDocument();
      expect(+radiobutton.value).toBe(index + 1);
    });
  });

  it('should render elements in correct order', () => {
    render(<StarsRating value={0} onChange={vi.fn()} />);
    const container = screen.getByTestId(containerElementTestId);
    const expectedOrder = [
      'input', 'label',
      'input', 'label',
      'input', 'label',
      'input', 'label',
      'input', 'label'
    ];
    const expectedValuesAndLabels = [
      '5', 'perfect',
      '4', 'good',
      '3', 'not bad',
      '2', 'badly',
      '1', 'terribly'
    ];

    Array.from(container.children).forEach((element, index) => {
      const elementTag = element.tagName.toLowerCase();
      expect(elementTag).toBe(expectedOrder[index]);

      if (elementTag === 'input') {
        expect(element).toHaveAttribute('value', expectedValuesAndLabels[index]);
      } else {
        expect(element).toHaveTextContent(expectedValuesAndLabels[index]);
      }
    });
  });

  it('should call onChange callback once when user click on not checked radiobutton', async () => {
    const mockChangeHandler = vi.fn();

    render(<StarsRating value={0} onChange={mockChangeHandler} />);
    const label = screen.getByRole('radio', { name: 'not bad' });
    await userEvent.click(label);

    expect(mockChangeHandler).toHaveBeenCalledOnce();
  });

  describe('value prop', () => {
    it('should not checked radiobuttons when prop is 0', () => {
      render(<StarsRating value={0} onChange={vi.fn()} />);
      expect(screen.queryByRole('radio', { checked: true })).not.toBeInTheDocument();
    });

    it('should not checked radiobuttons when prop is greater than max value (5)', () => {
      render(<StarsRating value={6} onChange={vi.fn()} />);
      expect(screen.queryByRole('radio', { checked: true })).not.toBeInTheDocument();
    });

    it.each([1, 2, 3, 4, 5])('should check corresponding radiobutton when prop is %d', (value) => {
      render(<StarsRating value={value} onChange={vi.fn()} />);
      const checkedRadiobutton: HTMLInputElement = screen.getByRole('radio', { checked: true });

      expect(+checkedRadiobutton.value).toBe(value);
    });

    it('should check corresponding radiobutton when prop is change', () => {
      const expectedValue = 5;

      const { rerender } = render(<StarsRating value={4} onChange={vi.fn()} />);
      rerender(<StarsRating value={expectedValue} onChange={vi.fn()} />);
      const checkedRadiobutton: HTMLInputElement = screen.getByRole('radio', { checked: true });

      expect(+checkedRadiobutton.value).toBe(expectedValue);
    });
  });

  describe('disabled prop', () => {
    it('should not disable radiobuttons when prop is missing', () => {
      render(<StarsRating value={0} onChange={vi.fn()} />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeEnabled());
    });

    it('should not disable radiobuttons when prop is false', () => {
      render(<StarsRating value={0} onChange={vi.fn()} disabled={false} />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeEnabled());
    });

    it('should disable radiobuttons when prop is true', () => {
      render(<StarsRating value={0} onChange={vi.fn()} disabled />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeDisabled());
    });

    it('should disable radiobuttons when prop change to true', () => {
      const { rerender } = render(<StarsRating value={0} onChange={vi.fn()} />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeEnabled());

      rerender(<StarsRating value={0} onChange={vi.fn()} disabled />);

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeDisabled());
    });

    it('should enable radiobuttons when prop change to false', () => {
      const { rerender } = render(<StarsRating value={0} onChange={vi.fn()} disabled />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeDisabled());

      rerender(<StarsRating value={0} onChange={vi.fn()} />);

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeEnabled());
    });
  });

  describe('className prop', () => {
    const baseClassName = 'form__rating';

    it('should have base classes when prop is missing', () => {
      render(<StarsRating value={0} onChange={vi.fn()} />);

      expect(screen.getByTestId(containerElementTestId)).toHaveAttribute('class', baseClassName);
    });

    it('should add the passed classes to the base classes when prop is present', () => {
      const passedClassName = 'reviews__rating-form';
      const expectedClassName = `${baseClassName} ${passedClassName}`;

      render(<StarsRating value={0} onChange={vi.fn()} className={passedClassName} />);

      expect(screen.getByTestId(containerElementTestId)).toHaveAttribute('class', expectedClassName);
    });
  });
});
