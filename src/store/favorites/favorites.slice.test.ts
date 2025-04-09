import { RequestStatus, FavoriteStatus } from '../../const';
import { FavoritesState } from '../../types/state';
import { fetchFavorites, changeFavoriteStatus } from '../async-actions';
import { getMockOffers, getMockCardOffer } from '../../mocks/util';
import { favorites } from './favorites.slice';

describe('Favorites slice', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: FavoritesState = {
      favorites: getMockOffers(4),
      loadingStatus: RequestStatus.Success,
      changingOffersIds: ['id1', 'id2'],
    };
    const unknownAction = { type: '' };

    const result = favorites.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const expectedState: FavoritesState = {
      favorites: [],
      loadingStatus: RequestStatus.None,
      changingOffersIds: [],
    };
    const unknownAction = { type: '' };

    const result = favorites.reducer(undefined, unknownAction);

    expect(result).toEqual(expectedState);
  });

  describe('fetchFavorites', () => {
    it('should set "Pending" loading status on "fetchFavorites.pending" action', () => {
      const expectedState: FavoritesState = {
        favorites: [],
        loadingStatus: RequestStatus.Pending,
        changingOffersIds: [],
      };

      const result = favorites.reducer(undefined, fetchFavorites.pending);

      expect(result).toEqual(expectedState);
    });

    it('should set favorites data and "Success" loading status on "fetchFavorites.fulfilled" action', () => {
      const mockOffers = getMockOffers(4, { isFavorite: true });
      const initialState: FavoritesState = {
        favorites: [],
        loadingStatus: RequestStatus.Pending,
        changingOffersIds: [],
      };
      const expectedState: FavoritesState = {
        favorites: mockOffers,
        loadingStatus: RequestStatus.Success,
        changingOffersIds: [],
      };

      const result = favorites.reducer(initialState, fetchFavorites.fulfilled(
        mockOffers, '', undefined
      ));

      expect(result).toEqual(expectedState);
    });

    it('should set "Error" loading status on "fetchFavorites.rejected" action', () => {
      const initialState: FavoritesState = {
        favorites: [],
        loadingStatus: RequestStatus.Pending,
        changingOffersIds: [],
      };
      const expectedState: FavoritesState = {
        favorites: [],
        loadingStatus: RequestStatus.Error,
        changingOffersIds: [],
      };

      const result = favorites.reducer(initialState, fetchFavorites.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('changeFavoriteStatus', () => {
    it('should not modify favorites data and add offer ID to "changingOffersIds" array on "changeFavoriteStatus.pending" action', () => {
      const mockChangingOfferId = 'changing-offer-id';
      const initialState: FavoritesState = {
        favorites: [],
        loadingStatus: RequestStatus.Success,
        changingOffersIds: ['id1', 'id2'],
      };
      const expectedState: FavoritesState = {
        favorites: [],
        loadingStatus: RequestStatus.Success,
        changingOffersIds: ['id1', 'id2', mockChangingOfferId],
      };

      const result = favorites.reducer(initialState, changeFavoriteStatus.pending(
        '', { offerId: mockChangingOfferId, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });

    describe('adding to favorites', () => {
      it('should add offer to favorites data and remove its ID from "changingOffersIds" array when adding succeeds on "changeFavoriteStatus.fulfilled" action', () => {
        const mockFavoritesOffers = getMockOffers(3, { isFavorite: true });
        const mockChangedOffer = getMockCardOffer({ isFavorite: true });
        const initialState: FavoritesState = {
          favorites: mockFavoritesOffers,
          loadingStatus: RequestStatus.Success,
          changingOffersIds: ['id1', mockChangedOffer.id, 'id2'],
        };
        const expectedState: FavoritesState = {
          favorites: [...mockFavoritesOffers, mockChangedOffer],
          loadingStatus: RequestStatus.Success,
          changingOffersIds: ['id1', 'id2'],
        };

        const result = favorites.reducer(initialState, changeFavoriteStatus.fulfilled(
          mockChangedOffer, '', { offerId: mockChangedOffer.id, status: FavoriteStatus.On }
        ));

        expect(result).toEqual(expectedState);
      });

      it('should not modify favorites data when adding favorite fails and remove offer ID from "changingOffersIds" array on "changeFavoriteStatus.rejected" action', () => {
        const mockChangingOffer = getMockCardOffer({ isFavorite: false });
        const initialState: FavoritesState = {
          favorites: [],
          loadingStatus: RequestStatus.Success,
          changingOffersIds: ['id1', mockChangingOffer.id, 'id2'],
        };
        const expectedState: FavoritesState = {
          favorites: [],
          loadingStatus: RequestStatus.Success,
          changingOffersIds: ['id1', 'id2'],
        };

        const result = favorites.reducer(initialState, changeFavoriteStatus.rejected(
          null, '', { offerId: mockChangingOffer.id, status: FavoriteStatus.On }
        ));

        expect(result).toEqual(expectedState);
      });
    });

    describe('removing from favorites', () => {
      it('should remove offer from favorites data and remove its ID from "changingOffersIds" array when removing succeeds on "changeFavoriteStatus.fulfilled" action', () => {
        const mockPreviousFavoritesOffers = getMockOffers(2, { isFavorite: true });
        const mockNextFavoritesOffers = getMockOffers(3, { isFavorite: true });
        const mockChangedOffer = getMockCardOffer({ isFavorite: true });

        const initialState: FavoritesState = {
          favorites: [...mockPreviousFavoritesOffers, mockChangedOffer, ...mockNextFavoritesOffers],
          loadingStatus: RequestStatus.Success,
          changingOffersIds: ['id1', mockChangedOffer.id, 'id2'],
        };
        const expectedState: FavoritesState = {
          favorites: [...mockPreviousFavoritesOffers, ...mockNextFavoritesOffers],
          loadingStatus: RequestStatus.Success,
          changingOffersIds: ['id1', 'id2'],
        };

        const result = favorites.reducer(initialState, changeFavoriteStatus.fulfilled(
          { ...mockChangedOffer, isFavorite: false }, '', { offerId: mockChangedOffer.id, status: FavoriteStatus.Off }
        ));

        expect(result).toEqual(expectedState);
      });

      it('should not modify favorites data when removing favorite fails and remove offer ID from "changingOffersIds" array on "changeFavoriteStatus.rejected" action', () => {
        const mockChangingOffer = getMockCardOffer({ isFavorite: true });
        const initialState: FavoritesState = {
          favorites: [mockChangingOffer],
          loadingStatus: RequestStatus.Success,
          changingOffersIds: ['id1', mockChangingOffer.id, 'id2'],
        };
        const expectedState: FavoritesState = {
          favorites: [mockChangingOffer],
          loadingStatus: RequestStatus.Success,
          changingOffersIds: ['id1', 'id2'],
        };

        const result = favorites.reducer(initialState, changeFavoriteStatus.rejected(
          null, '', { offerId: mockChangingOffer.id, status: FavoriteStatus.Off }
        ));

        expect(result).toEqual(expectedState);
      });
    });
  });
});
