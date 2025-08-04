import { screen, render } from '@testing-library/react';
import { withHistory } from '../../../mocks/render-helpers';
import { AppRoute } from '../../../const';
import NotFoundPage from './not-found-page';

describe('Component: NotFoundPage', () => {
  it('should render correctly', () => {
    render(withHistory(<NotFoundPage />));
    const headingElement = screen.getByText('404 Not Found');
    const linkElement = screen.getByRole('link', { name: 'Go to Homepage' });

    expect(headingElement).toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', AppRoute.Root);
  });
});
