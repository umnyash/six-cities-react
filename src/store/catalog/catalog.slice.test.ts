import { CatalogState } from '../../types/state';
import { catalog, setCity, setSorting } from './catalog.slice';
import { RequestStatus, CITIES, SortingOption, FavoriteStatus } from '../../const';
import { getMockOffers, getMockCardOffer } from '../../mocks/data';
import { fetchAllOffers, changeFavoriteStatus } from '../async-actions';

describe('Catalog slice', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: CatalogState = {
      offers: getMockOffers(3),
      loadingStatus: RequestStatus.Success,
      city: CITIES[2],
      sorting: SortingOption.PriceAsc,
    };
    const unknownAction = { type: '' };

    const result = catalog.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: CatalogState = {
      offers: [],
      loadingStatus: RequestStatus.None,
      city: CITIES[0],
      sorting: SortingOption.Default,
    };
    const unknownAction = { type: '' };

    const result = catalog.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  it('should change city on "setCity" action', () => {
    const expectedState: CatalogState = {
      offers: [],
      loadingStatus: RequestStatus.None,
      city: CITIES[3],
      sorting: SortingOption.Default,
    };

    const result = catalog.reducer(undefined, setCity(CITIES[3]));

    expect(result).toEqual(expectedState);
  });

  it('should change sorting on "setSorting" action', () => {
    const expectedState: CatalogState = {
      offers: [],
      loadingStatus: RequestStatus.None,
      city: CITIES[0],
      sorting: SortingOption.RatingDesc,
    };

    const result = catalog.reducer(undefined, setSorting(SortingOption.RatingDesc));

    expect(result).toEqual(expectedState);
  });

  describe('fetchAllOffers', () => {
    it('should set pending loading status on "fetchAllOffers.pending" action', () => {
      const expectedState: CatalogState = {
        offers: [],
        loadingStatus: RequestStatus.Pending,
        city: CITIES[0],
        sorting: SortingOption.Default,
      };

      const result = catalog.reducer(undefined, fetchAllOffers.pending);

      expect(result).toEqual(expectedState);
    });

    it('should set offers data and success loading status on "fetchAllOffers.fulfilled" action', () => {
      const initialState: CatalogState = {
        offers: [],
        loadingStatus: RequestStatus.Pending,
        city: CITIES[0],
        sorting: SortingOption.Default,
      };
      const mockOffers = getMockOffers(2);
      const expectedState: CatalogState = {
        offers: mockOffers,
        loadingStatus: RequestStatus.Success,
        city: CITIES[0],
        sorting: SortingOption.Default,
      };

      const result = catalog.reducer(initialState, fetchAllOffers.fulfilled(
        mockOffers, '', undefined
      ));

      expect(result).toEqual(expectedState);
    });

    it('should set error loading status on "fetchAllOffers.rejected" action', () => {
      const initialState: CatalogState = {
        offers: [],
        loadingStatus: RequestStatus.Pending,
        city: CITIES[0],
        sorting: SortingOption.Default,
      };
      const expectedState: CatalogState = {
        offers: [],
        loadingStatus: RequestStatus.Error,
        city: CITIES[0],
        sorting: SortingOption.Default,
      };

      const result = catalog.reducer(initialState, fetchAllOffers.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('changeFavoritesStatus', () => {
    it('should change favorite status for the corresponding offer in offers array if offers have been loaded on "changeFavoriteStatus.fulfilled" action', () => {
      const mockOffers = getMockOffers(1);
      const mockTargetOffer = getMockCardOffer({ isFavorite: false });
      const initialState: CatalogState = {
        offers: [...mockOffers, mockTargetOffer],
        loadingStatus: RequestStatus.Success,
        city: CITIES[0],
        sorting: SortingOption.Default,
      };
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const expectedState: CatalogState = {
        offers: [...mockOffers, mockTargetChangedOffer],
        loadingStatus: RequestStatus.Success,
        city: CITIES[0],
        sorting: SortingOption.Default,
      };

      const result = catalog.reducer(initialState, changeFavoriteStatus.fulfilled(
        mockTargetChangedOffer, '', { offerId: mockTargetOffer.id, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });

    it('should not throw an error if the corresponding offer is not found in offers array if the offers are not loaded on "changeFavoriteStatus.fulfilled" action', () => {
      const mockChangedOffer = getMockCardOffer({ isFavorite: true });
      const initialState: CatalogState = {
        offers: [],
        loadingStatus: RequestStatus.None,
        city: CITIES[0],
        sorting: SortingOption.Default,
      };

      expect(() => {
        catalog.reducer(initialState, changeFavoriteStatus.fulfilled(
          mockChangedOffer, '', { offerId: mockChangedOffer.id, status: FavoriteStatus.On }
        ));
      }).not.toThrow();
    });
  });
});
