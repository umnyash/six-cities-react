import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoute, APP_ROUTE_PARAM_ID } from '../../../const';
import { OfferCardVariant } from './const';
import { getMockCardOffer } from '../../../data/mocks';
import { withHistory } from '../../../tests/render-helpers';
import FavoriteButton from '../favorite-button';
import StarsIcon from '../stars-icon';

import OfferCard from './offer-card';

vi.mock('../favorite-button', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../stars-icon', () => ({
  default: vi.fn(() => null)
}));

describe('Component: OfferCard', () => {
  const mockOffer = getMockCardOffer();

  it('should render correctly', () => {
    const imageAltText = 'Place image';
    const route = AppRoute.Offer.replace(APP_ROUTE_PARAM_ID, mockOffer.id);
    const withHistoryComponent = withHistory(<OfferCard offer={mockOffer} />);

    render(withHistoryComponent);
    const headingElement = screen.getByRole('heading', { name: mockOffer.title });
    const headingLinkElement = screen.getByRole('link', { name: mockOffer.title });
    const imageElement = screen.getByRole('img', { name: imageAltText });
    const imageLinkElement = screen.getByRole('link', { name: imageAltText });
    const priceElement = screen.getByText(`€${mockOffer.price}`);
    const typeElement = screen.getByText(mockOffer.type);

    expect(headingElement).toBeInTheDocument();
    expect(priceElement).toBeInTheDocument();
    expect(typeElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockOffer.previewImage);
    [headingLinkElement, imageLinkElement].forEach((link) => expect(link).toHaveAttribute('href', route));
  });

  it('should correctly pass props to nested components', () => {
    const withHistoryComponent = withHistory(<OfferCard offer={mockOffer} />);

    render(withHistoryComponent);

    expect(FavoriteButton).toHaveBeenCalledWith({
      offerId: mockOffer.id,
      className: 'place-card__bookmark-button',
      isActive: mockOffer.isFavorite
    }, expect.anything());

    expect(StarsIcon).toHaveBeenCalledWith({
      rating: mockOffer.rating,
      withHiddenValue: true
    }, expect.anything());
  });

  describe('premium label', () => {
    const premiumLabelText = /Premium/;

    it('should render premium label when offer is premium', () => {
      const mockPremiumOffer = getMockCardOffer({ isPremium: true });
      const withHistoryComponent = withHistory(<OfferCard offer={mockPremiumOffer} />);

      render(withHistoryComponent);

      expect(screen.getByText(premiumLabelText)).toBeInTheDocument();
    });

    it('should not render premium label when offer is not premium', () => {
      const mockNotPremiumOffer = getMockCardOffer({ isPremium: false });
      const withHistoryComponent = withHistory(<OfferCard offer={mockNotPremiumOffer} />);

      render(withHistoryComponent);

      expect(screen.queryByText(premiumLabelText)).not.toBeInTheDocument();
    });
  });

  describe('variant prop', () => {
    const imageWrapperElementTestId = 'place-card-image-wrapper';
    const infoElementTestId = 'place-card-info';

    const cardVariantExpectedAttributes = {
      [OfferCardVariant.Default]: {
        cardClassName: 'place-card cities__card',
        cardImageWrapperClassName: 'place-card__image-wrapper',
        cardInfoClassName: 'place-card__info',
        imageWidth: '260',
        imageHeight: '200',
      },
      [OfferCardVariant.Compact]: {
        cardClassName: 'place-card favorites__card',
        cardImageWrapperClassName: 'place-card__image-wrapper favorites__image-wrapper',
        cardInfoClassName: 'place-card__info favorites__card-info',
        imageWidth: '150',
        imageHeight: '110',
        imageStyle: {
          maxHeight: '110px',
          objectFit: 'cover',
          objectPosition: 'center',
        },
      },
    } as const;

    it.each([
      {
        condition: `variant prop is missing (use "${OfferCardVariant.Default}" by default)`,
        expected: cardVariantExpectedAttributes[OfferCardVariant.Default],
      },
      {
        condition: `variant prop is "${OfferCardVariant.Default}"`,
        variant: OfferCardVariant.Default,
        expected: cardVariantExpectedAttributes[OfferCardVariant.Default],
      },
      {
        condition: `variant prop is "${OfferCardVariant.Compact}"`,
        variant: OfferCardVariant.Compact,
        expected: cardVariantExpectedAttributes[OfferCardVariant.Compact],
      },
    ])('should render correctly when $condition', ({ variant, expected }) => {
      const withHistoryComponent = withHistory(<OfferCard offer={mockOffer} variant={variant} />);

      render(withHistoryComponent);
      const cardElement = screen.getByRole('article');
      const infoElement = screen.getByTestId(infoElementTestId);
      const imageWrapperElement = screen.getByTestId(imageWrapperElementTestId);
      const imageElement = screen.getByRole('img');

      expect(cardElement).toHaveAttribute('class', expected.cardClassName);
      expect(infoElement).toHaveAttribute('class', expected.cardInfoClassName);
      expect(imageWrapperElement).toHaveAttribute('class', expected.cardImageWrapperClassName);
      expect(imageElement).toHaveAttribute('width', expected.imageWidth);
      expect(imageElement).toHaveAttribute('height', expected.imageHeight);

      if ('imageStyle' in expected) {
        expect(imageElement).toHaveStyle(expected.imageStyle);
      } else {
        expect(imageElement).not.toHaveAttribute('style');
      }
    });
  });

  describe('setOfferId prop', () => {
    it('should not throw errors when setOfferId prop is missing and user hovers mouse over the card or moves mouse away', async () => {
      const withHistoryComponent = withHistory(<OfferCard offer={mockOffer} />);

      render(withHistoryComponent);
      const card = screen.getByRole('article');
      await expect(userEvent.hover(card)).resolves.not.toThrow();
      await expect(userEvent.unhover(card)).resolves.not.toThrow();
    });

    describe('setOfferId prop is present', () => {
      const mockSetOfferId = vi.fn();

      beforeEach(() => {
        vi.clearAllMocks();
      });

      it('should call setOfferId once with offer id when user hovers the mouse over the card', async () => {
        const withHistoryComponent = withHistory(<OfferCard offer={mockOffer} setOfferId={mockSetOfferId} />);

        render(withHistoryComponent);
        const card = screen.getByRole('article');
        await userEvent.hover(card);

        expect(mockSetOfferId).toHaveBeenCalledOnce();
        expect(mockSetOfferId).toHaveBeenCalledWith(mockOffer.id);
      });

      it('should call setOfferId once with empty string when user moves the mouse away', async () => {
        const withHistoryComponent = withHistory(<OfferCard offer={mockOffer} setOfferId={mockSetOfferId} />);

        render(withHistoryComponent);
        const card = screen.getByRole('article');
        await userEvent.unhover(card);

        expect(mockSetOfferId).toHaveBeenCalledOnce();
        expect(mockSetOfferId).toHaveBeenCalledWith('');
      });
    });
  });
});
