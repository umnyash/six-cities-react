import { screen, render } from '@testing-library/react';
import { getMockAuthor } from '../../../mocks/data';
import OfferHost from './offer-host';

describe('Component: OfferHost', () => {
  it('should render correctly', () => {
    const mockHost = getMockAuthor();
    const avatarAltText = 'Host avatar';

    render(<OfferHost host={mockHost} />);
    const avatarImageElement = screen.getByAltText(avatarAltText);
    const nameElement = screen.getByText(mockHost.name);

    expect(avatarImageElement).toHaveAttribute('src', mockHost.avatarUrl);
    expect(nameElement).toBeInTheDocument();
  });

  describe('host\'s pro status', () => {
    const avatarWrapperTestId = 'offer-host-avatar-wrapper';
    const avatarProClassName = 'offer__avatar-wrapper--pro';
    const proBadgeText = 'Pro';

    it('should render correctly when author is pro', () => {
      const mockProAuthor = getMockAuthor({ isPro: true });

      render(<OfferHost host={mockProAuthor} />);
      const avatarWrapperElement = screen.getByTestId(avatarWrapperTestId);

      expect(avatarWrapperElement).toHaveClass(avatarProClassName);
      expect(screen.getByText(proBadgeText)).toBeInTheDocument();
    });

    it('should render correctly when author is pro', () => {
      const mockProAuthor = getMockAuthor({ isPro: false });

      render(<OfferHost host={mockProAuthor} />);
      const avatarWrapperElement = screen.getByTestId(avatarWrapperTestId);

      expect(avatarWrapperElement).not.toHaveClass(avatarProClassName);
      expect(screen.queryByText(proBadgeText)).not.toBeInTheDocument();
    });
  });
});
