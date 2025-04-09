import { OffersState } from '../../types/state';
import { offers, setCity, setSorting } from './offers.slice';
import { RequestStatus, CITIES, SortingOption, FavoriteStatus } from '../../const';
import { getMockOffers, getMockOffer, getMockCardOffer } from '../../mocks/util';
import { fetchAllOffers, fetchNearbyOffers, fetchOffer, changeFavoriteStatus } from '../async-actions';

describe('Offers slice', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: OffersState = {
      allOffers: getMockOffers(10),
      allOffersLoadingStatus: RequestStatus.Success,
      city: CITIES[2],
      sorting: SortingOption.PriceAsc,
      nearbyOffers: getMockOffers(3),
      nearbyOffersLoadingStatus: RequestStatus.Success,
      offer: getMockOffer(),
      offerLoadingStatus: RequestStatus.Success,
    };
    const unknownAction = { type: '' };

    const result = offers.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: OffersState = {
      allOffers: [],
      allOffersLoadingStatus: RequestStatus.None,
      city: CITIES[0],
      sorting: SortingOption.Default,
      nearbyOffers: [],
      nearbyOffersLoadingStatus: RequestStatus.None,
      offer: null,
      offerLoadingStatus: RequestStatus.None,
    };
    const unknownAction = { type: '' };

    const result = offers.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  it('should change city on "setCity" action', () => {
    const expectedState: OffersState = {
      allOffers: [],
      allOffersLoadingStatus: RequestStatus.None,
      city: CITIES[3],
      sorting: SortingOption.Default,
      nearbyOffers: [],
      nearbyOffersLoadingStatus: RequestStatus.None,
      offer: null,
      offerLoadingStatus: RequestStatus.None,
    };

    const result = offers.reducer(undefined, setCity(CITIES[3]));

    expect(result).toEqual(expectedState);
  });

  it('should change sorting on "setSorting" action', () => {
    const expectedState: OffersState = {
      allOffers: [],
      allOffersLoadingStatus: RequestStatus.None,
      city: CITIES[0],
      sorting: SortingOption.RatingDesc,
      nearbyOffers: [],
      nearbyOffersLoadingStatus: RequestStatus.None,
      offer: null,
      offerLoadingStatus: RequestStatus.None,
    };

    const result = offers.reducer(undefined, setSorting(SortingOption.RatingDesc));

    expect(result).toEqual(expectedState);
  });

  describe('fetchAllOffers', () => {
    it('should set "Pending" all offers loading status on "fetchAllOffers.pending" action', () => {
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.Pending,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };

      const result = offers.reducer(undefined, fetchAllOffers.pending);

      expect(result).toEqual(expectedState);
    });

    it('should set all offers data and "Success" all offers loading status on "fetchAllOffers.fulfilled" action', () => {
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.Pending,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };
      const mockAllOffers = getMockOffers(3);
      const expectedState: OffersState = {
        allOffers: mockAllOffers,
        allOffersLoadingStatus: RequestStatus.Success,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };

      const result = offers.reducer(initialState, fetchAllOffers.fulfilled(
        mockAllOffers, '', undefined
      ));

      expect(result).toEqual(expectedState);
    });

    it('should set "Error" all offers loading status on "fetchAllOffers.rejected" action', () => {
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.Pending,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.Error,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };

      const result = offers.reducer(initialState, fetchAllOffers.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('fetchNearbyOffers', () => {
    it('should set "Pending" nearby offers loading status on "fetchNearbyOffers.pending" action', () => {
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.Pending,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };

      const result = offers.reducer(undefined, fetchNearbyOffers.pending);

      expect(result).toEqual(expectedState);
    });

    it('should set nearby offers data and "Success" nearby offers loading status on "fetchNearbyOffers.fulfilled" action', () => {
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.Pending,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };
      const mockAllOffers = getMockOffers(3);
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: mockAllOffers,
        nearbyOffersLoadingStatus: RequestStatus.Success,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };

      const result = offers.reducer(initialState, fetchNearbyOffers.fulfilled(
        mockAllOffers, '', 'someOfferId'
      ));

      expect(result).toEqual(expectedState);
    });
  });

  describe('fetchOffer', () => {
    it('should set "Pending" offer loading status on "fetchOffer.pending" action', () => {
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.Pending,
      };

      const result = offers.reducer(undefined, fetchOffer.pending);

      expect(result).toEqual(expectedState);
    });

    it('should set offer data and "Success" offer loading status on "fetchOffer.fulfilled" action', () => {
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.Pending,
      };
      const mockOffer = getMockOffer();
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: mockOffer,
        offerLoadingStatus: RequestStatus.Success,
      };

      const result = offers.reducer(initialState, fetchOffer.fulfilled(
        mockOffer, '', 'someOfferId'
      ));

      expect(result).toEqual(expectedState);
    });

    it('should set "Error" offer loading status on "fetchOffer.rejected" action', () => {
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.Pending,
      };
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.Error,
      };

      const result = offers.reducer(initialState, fetchOffer.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('changeFavoritesStatus', () => {
    it('should change favorite status for the corresponding offer in "allOffers" array if all offers have been loaded on "changeFavoriteStatus.fulfilled" action', () => {
      const mockAllOffers = getMockOffers(1);
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const initialState: OffersState = {
        allOffers: [...mockAllOffers, mockTargetOffer],
        allOffersLoadingStatus: RequestStatus.Success,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const expectedState: OffersState = {
        allOffers: [...mockAllOffers, mockTargetChangedOffer],
        allOffersLoadingStatus: RequestStatus.Success,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };

      const result = offers.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });

    it('should not throw an error if the corresponding offer is not found in "allOffers" array if the all offers are not loaded on "changeFavoriteStatus.fulfilled" action', () => {
      const mockChangedOffer = getMockCardOffer({ isFavorite: true });
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };

      expect(() => {
        offers.reducer(initialState, changeFavoriteStatus.fulfilled(
          mockChangedOffer, '', { offerId: mockChangedOffer.id, status: FavoriteStatus.On }
        ));
      }).not.toThrow();
    });

    it('should change favorite status for the corresponding offer in "nearbyOffers" array if it is there on "changeFavoriteStatus.fulfilled" action', () => {
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const mockSomeNearbyOffers = getMockOffers(2);
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [mockTargetOffer, ...mockSomeNearbyOffers],
        nearbyOffersLoadingStatus: RequestStatus.Success,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [mockTargetChangedOffer, ...mockSomeNearbyOffers],
        nearbyOffersLoadingStatus: RequestStatus.Success,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };

      const result = offers.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });

    it('should not modify "nearbyOffers" array if the corresponding offer is not in it on "changeFavoriteStatus.fulfilled" action', () => {
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const mockSomeNearbyOffers = getMockOffers(3);
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: mockSomeNearbyOffers,
        nearbyOffersLoadingStatus: RequestStatus.Success,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: mockSomeNearbyOffers,
        nearbyOffersLoadingStatus: RequestStatus.Success,
        offer: null,
        offerLoadingStatus: RequestStatus.None,
      };

      const result = offers.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });

    it('should change the favorite status of the offer in the "offer" field if the id matches on "changeFavoriteStatus.fulfilled" action', () => {
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const mockOffer = { ...getMockOffer(), ...mockTargetOffer };
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: mockOffer,
        offerLoadingStatus: RequestStatus.Success,
      };
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const mockChangedOffer = { ...mockOffer, isFavorite: true };
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: mockChangedOffer,
        offerLoadingStatus: RequestStatus.Success,
      };

      const result = offers.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });

    it('should not change the favorite status of the offer in the offer field if the id does not match on "changeFavoriteStatus.fulfilled" action', () => {
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const mockOffer = getMockOffer();
      const initialState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: mockOffer,
        offerLoadingStatus: RequestStatus.Success,
      };
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const expectedState: OffersState = {
        allOffers: [],
        allOffersLoadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
        nearbyOffers: [],
        nearbyOffersLoadingStatus: RequestStatus.None,
        offer: mockOffer,
        offerLoadingStatus: RequestStatus.Success,
      };

      const result = offers.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });
  });
});
