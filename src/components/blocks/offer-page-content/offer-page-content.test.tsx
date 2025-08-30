import { screen, render } from '@testing-library/react';

import { NEARBY_OFFERS_COUNT, RequestStatus, NameSpace } from '../../../const';
import { State } from '../../../types/state';
import { getMockOffer, getMockOffers } from '../../../data/mocks';
import { withStore } from '../../../tests/render-helpers';
import { useArrayRandomIndices } from '../../../hooks';
import Offer from '../offer';
import Offers from '../offers';

import OfferPageContent from './offer-page-content';

vi.mock('../offer', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../offers', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../../hooks/use-array-random-indices/use-array-random-indices', () => ({
  useArrayRandomIndices: vi.fn(() => [])
}));

describe('Component: OfferPageContent', () => {
  const heading = 'Other places in the neighbourhood';
  const offer = getMockOffer();
  let mockInitialState: Pick<State, NameSpace.NearbyOffers>;

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.NearbyOffers]: {
        offers: [],
        loadingStatus: RequestStatus.None,
      }
    };

    vi.clearAllMocks();
  });


  it('should render correctly', () => {
    const { withStoreComponent } = withStore(<OfferPageContent offer={offer} />, mockInitialState);
    render(withStoreComponent);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it.each([
    {
      nearbyOffersLoadingStatus: RequestStatus.Pending,
      allNearbyOffers: [],
      indices: [],
    },
    {
      nearbyOffersLoadingStatus: RequestStatus.Success,
      allNearbyOffers: [],
      indices: [],
    },
    {
      nearbyOffersLoadingStatus: RequestStatus.Success,
      allNearbyOffers: getMockOffers(7),
      indices: [3, 1, 5],
    },
    {
      nearbyOffersLoadingStatus: RequestStatus.Error,
      allNearbyOffers: [],
      indices: [],
    },
  ])(
    'should correctly call useArrayRandomIndices hook and pass props to nested components',
    ({ nearbyOffersLoadingStatus, allNearbyOffers, indices }) => {
      mockInitialState[NameSpace.NearbyOffers].offers = allNearbyOffers;
      mockInitialState[NameSpace.NearbyOffers].loadingStatus = nearbyOffersLoadingStatus;
      vi.mocked(useArrayRandomIndices).mockReturnValue(indices);

      const { withStoreComponent } = withStore(<OfferPageContent offer={offer} />, mockInitialState);
      const randomNearbyOffers = indices.map((index) => allNearbyOffers[index]);

      render(withStoreComponent);

      expect(useArrayRandomIndices).toHaveBeenCalledWith(
        allNearbyOffers.length, NEARBY_OFFERS_COUNT, nearbyOffersLoadingStatus
      );
      expect(Offer).toHaveBeenCalledWith(
        { offer, nearbyOffers: randomNearbyOffers }, expect.anything()
      );
      expect(Offers).toHaveBeenCalledWith(
        { heading, offers: randomNearbyOffers }, expect.anything()
      );
    }
  );
});
