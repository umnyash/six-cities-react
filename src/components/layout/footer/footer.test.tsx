import { screen, render } from '@testing-library/react';

import { AppRoute } from '../../../const';
import { withHistory } from '../../../mocks/render-helpers';

import Footer from './footer';

describe('Component: Footer', () => {
  it('should render correctly', () => {
    const expectedAltText = '6 cities logo';

    render(withHistory(<Footer />));
    const linkElement = screen.getByRole('link', { name: expectedAltText });
    const imageElement = screen.getByRole('img', { name: expectedAltText });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', AppRoute.Root);
    expect(imageElement).toBeInTheDocument();
  });
});
