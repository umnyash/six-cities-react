import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import { AppRoute } from '../../../const';
import { withHistory } from '../../../mocks/render-helpers';

import Logo from './logo';

describe('Component: Logo', () => {
  it('should render correctly', () => {
    const expectedAltText = '6 cities logo';

    render(withHistory(<Logo />));
    const imageElement = screen.getByRole('img', { name: expectedAltText });

    expect(imageElement).toBeInTheDocument();
  });

  it('should not render link when current path is "/"', () => {
    const mockHistory = createMemoryHistory();
    mockHistory.push(AppRoute.Root);
    const withHistoryComponent = withHistory(
      <Logo />,
      mockHistory
    );

    render(withHistoryComponent);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render link when current path is not "/"', () => {
    const mockHistory = createMemoryHistory();
    mockHistory.push(AppRoute.Offer);
    const withHistoryComponent = withHistory(
      <Logo />,
      mockHistory
    );

    render(withHistoryComponent);

    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
