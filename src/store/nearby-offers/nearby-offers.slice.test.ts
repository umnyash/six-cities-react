import { NearbyOffersState } from '../../types/state';
import { nearbyOffers } from './nearby-offers.slice';
import { RequestStatus, FavoriteStatus } from '../../const';
import { getMockOffers, getMockCardOffer } from '../../mocks/data';
import { fetchNearbyOffers, changeFavoriteStatus } from '../async-actions';

describe('Nearby offers slice', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: NearbyOffersState = {
      offers: getMockOffers(1),
      loadingStatus: RequestStatus.Success,
    };
    const unknownAction = { type: '' };

    const result = nearbyOffers.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: NearbyOffersState = {
      offers: [],
      loadingStatus: RequestStatus.None,
    };
    const unknownAction = { type: '' };

    const result = nearbyOffers.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  describe('fetchNearbyOffers', () => {
    it('should set pending loading status on "fetchNearbyOffers.pending" action', () => {
      const expectedState: NearbyOffersState = {
        offers: [],
        loadingStatus: RequestStatus.Pending,
      };

      const result = nearbyOffers.reducer(undefined, fetchNearbyOffers.pending);

      expect(result).toEqual(expectedState);
    });

    it('should set offers data and success loading status on "fetchNearbyOffers.fulfilled" action', () => {
      const initialState: NearbyOffersState = {
        offers: [],
        loadingStatus: RequestStatus.Pending,
      };
      const mockOffers = getMockOffers(1);
      const expectedState: NearbyOffersState = {
        offers: mockOffers,
        loadingStatus: RequestStatus.Success,
      };

      const result = nearbyOffers.reducer(initialState, fetchNearbyOffers.fulfilled(
        mockOffers, '', 'someOfferId'
      ));

      expect(result).toEqual(expectedState);
    });
  });

  describe('changeFavoritesStatus', () => {
    it('should change favorite status for the corresponding offer on "changeFavoriteStatus.fulfilled" action', () => {
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const mockSomeOffers = getMockOffers(2);
      const initialState: NearbyOffersState = {
        offers: [mockTargetOffer, ...mockSomeOffers],
        loadingStatus: RequestStatus.Success,
      };
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const expectedState: NearbyOffersState = {
        offers: [mockTargetChangedOffer, ...mockSomeOffers],
        loadingStatus: RequestStatus.Success,
      };

      const result = nearbyOffers.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });

    it('should not modify offers array if it does not contain the corresponding offer on "changeFavoriteStatus.fulfilled" action', () => {
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const mockSomeOffers = getMockOffers(2);
      const initialState: NearbyOffersState = {
        offers: mockSomeOffers,
        loadingStatus: RequestStatus.Success,
      };
      const expectedState: NearbyOffersState = {
        offers: mockSomeOffers,
        loadingStatus: RequestStatus.Success,
      };

      const result = nearbyOffers.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });
  });
});
