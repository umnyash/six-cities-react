import { screen, render, within } from '@testing-library/react';

import { OFFER_PHOTOS_MAX_COUNT } from '../../../const';
import { StarsIconSize } from '../../ui/stars-icon';
import { getMockOffer, getMockOffers } from '../../../mocks/data';
import FavoriteButton from '../../ui/favorite-button';
import StarsIcon from '../../ui/stars-icon';
import OfferHost from '../../ui/offer-host';
import Reviews from '../reviews';
import Map from '../map';

import Offer from './offer';

enum TestId {
  Gallery = 'offer-gallery',
  RatingValue = 'offer-rating-value',
}

vi.mock('../../ui/favorite-button', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../ui/stars-icon', async () => {
  const originalModule = await vi.importActual('../../ui/stars-icon');

  return {
    ...originalModule,
    default: vi.fn(() => null)
  };
});

vi.mock('../../ui/offer-host', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../reviews', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../map', () => ({
  default: vi.fn(() => null)
}));

describe('Component: Offer', () => {
  const mockOffer = getMockOffer({ isFavorite: true });
  const mockNearbyOffers = getMockOffers(3);

  it('should render correcty', () => {
    render(<Offer offer={mockOffer} nearbyOffers={mockNearbyOffers} />);
    const galleryElement = screen.getByTestId(TestId.Gallery);
    const ratingValueElement = screen.getByTestId(TestId.RatingValue);

    expect(screen.getByRole('heading', { name: mockOffer.title })).toBeInTheDocument();
    expect(screen.getByText(mockOffer.type)).toBeInTheDocument();
    expect(screen.getByText(`€${mockOffer.price}`)).toBeInTheDocument();
    expect(ratingValueElement).toHaveTextContent(String(mockOffer.rating));
    expect(within(galleryElement).getAllByRole('img')).toHaveLength(Math.min(mockOffer.images.length, OFFER_PHOTOS_MAX_COUNT));
    expect(screen.getByText(mockOffer.description)).toBeInTheDocument();
    expect(screen.getByText(`Max ${mockOffer.maxAdults} adults`)).toBeInTheDocument();
    expect(screen.getByText(`${mockOffer.bedrooms} Bedrooms`)).toBeInTheDocument();
    mockOffer.goods.forEach((good) => expect(screen.getByText(good)).toBeInTheDocument());
  });

  describe('premium', () => {
    const premiumText = 'Premium';

    it('should render "Premium" text when offer is premium', () => {
      const mockPremiumOffer = getMockOffer({ isPremium: true });
      render(<Offer offer={mockPremiumOffer} nearbyOffers={mockNearbyOffers} />);
      expect(screen.getByText(premiumText)).toBeInTheDocument();
    });

    it('should not render "Premium" text when offer is not premium', () => {
      const mockNotPremiumOffer = getMockOffer({ isPremium: false });
      render(<Offer offer={mockNotPremiumOffer} nearbyOffers={mockNearbyOffers} />);
      expect(screen.queryByText(premiumText)).not.toBeInTheDocument();
    });
  });

  it('should correctly pass props to nested components', () => {
    render(<Offer offer={mockOffer} nearbyOffers={mockNearbyOffers} />);

    expect(FavoriteButton).toHaveBeenCalledWith({
      offerId: mockOffer.id,
      className: 'offer__bookmark-button',
      isActive: mockOffer.isFavorite
    }, expect.anything());

    expect(StarsIcon).toHaveBeenCalledWith({
      rating: mockOffer.rating,
      size: StarsIconSize.L
    }, expect.anything());

    expect(OfferHost).toHaveBeenCalledWith({
      host: mockOffer.host
    }, expect.anything());

    expect(Reviews).toHaveBeenCalledWith({
      offerId: mockOffer.id
    }, expect.anything());

    expect(Map).toHaveBeenCalledWith({
      className: 'offer__map',
      location: mockOffer.city.location,
      points: [...mockNearbyOffers, mockOffer],
      activePointId: mockOffer.id
    }, expect.anything());
  });
});
