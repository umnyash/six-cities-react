import { OfferState } from '../../types/state';
import { offer } from './offer.slice';
import { RequestStatus, FavoriteStatus } from '../../const';
import { getMockOffer, getMockCardOffer } from '../../mocks/data';
import { fetchOffer, changeFavoriteStatus } from '../async-actions';

describe('Offer slice', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: OfferState = {
      offer: getMockOffer(),
      loadingStatus: RequestStatus.Success,
    };
    const unknownAction = { type: '' };

    const result = offer.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: OfferState = {
      offer: null,
      loadingStatus: RequestStatus.None,
    };
    const unknownAction = { type: '' };

    const result = offer.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  describe('fetchOffer', () => {
    it('should set pending loading status on "fetchOffer.pending" action', () => {
      const expectedState: OfferState = {
        offer: null,
        loadingStatus: RequestStatus.Pending,
      };

      const result = offer.reducer(undefined, fetchOffer.pending);

      expect(result).toEqual(expectedState);
    });

    it('should set offer data and success loading status on "fetchOffer.fulfilled" action', () => {
      const initialState: OfferState = {
        offer: null,
        loadingStatus: RequestStatus.Pending,
      };
      const mockOffer = getMockOffer();
      const expectedState: OfferState = {
        offer: mockOffer,
        loadingStatus: RequestStatus.Success,
      };

      const result = offer.reducer(initialState, fetchOffer.fulfilled(
        mockOffer, '', 'someOfferId'
      ));

      expect(result).toEqual(expectedState);
    });

    it('should set error loading status on "fetchOffer.rejected" action', () => {
      const initialState: OfferState = {
        offer: null,
        loadingStatus: RequestStatus.Pending,
      };
      const expectedState: OfferState = {
        offer: null,
        loadingStatus: RequestStatus.Error,
      };

      const result = offer.reducer(initialState, fetchOffer.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('changeFavoritesStatus', () => {
    it('should change the offer favorite status if the id matches on "changeFavoriteStatus.fulfilled" action', () => {
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const mockOffer = { ...getMockOffer(), ...mockTargetOffer };
      const initialState: OfferState = {
        offer: mockOffer,
        loadingStatus: RequestStatus.Success,
      };
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const mockChangedOffer = { ...mockOffer, isFavorite: true };
      const expectedState: OfferState = {
        offer: mockChangedOffer,
        loadingStatus: RequestStatus.Success,
      };

      const result = offer.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });

    it('should not change the offer favorite status if the id does not match on "changeFavoriteStatus.fulfilled" action', () => {
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const mockOffer = getMockOffer();
      const initialState: OfferState = {
        offer: mockOffer,
        loadingStatus: RequestStatus.Success,
      };
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const expectedState: OfferState = {
        offer: mockOffer,
        loadingStatus: RequestStatus.Success,
      };

      const result = offer.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });
  });
});
