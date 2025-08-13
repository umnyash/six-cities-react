import { CatalogState } from '../../types/state';
import { catalog, setCity, setSorting, setActiveOfferId } from './catalog.slice';
import { RequestStatus, CITIES, SortingOption } from '../../const';
import { FavoriteStatus } from '../../services/api';
import { getMockOffers, getMockCardOffer } from '../../mocks/data';
import { fetchAllOffers, changeFavoriteStatus } from '../async-actions';

describe('Catalog slice', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: CatalogState = {
      offers: getMockOffers(3),
      loadingStatus: RequestStatus.Success,
      city: CITIES[2],
      sorting: SortingOption.PriceAsc,
      activeOfferId: '68a9fb53-f459-43be-b062-c23bc10d3067',
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
      activeOfferId: '',
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
      activeOfferId: '',
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
      activeOfferId: '',
    };

    const result = catalog.reducer(undefined, setSorting(SortingOption.RatingDesc));

    expect(result).toEqual(expectedState);
  });

  it('should change active offer id on "setActiveOfferId" action', () => {
    const expectedState: CatalogState = {
      offers: [],
      loadingStatus: RequestStatus.None,
      city: CITIES[0],
      sorting: SortingOption.Default,
      activeOfferId: 'c207bc3e-93ca-43e5-b9b9-e84476a946b6',
    };

    const result = catalog.reducer(undefined, setActiveOfferId('c207bc3e-93ca-43e5-b9b9-e84476a946b6'));

    expect(result).toEqual(expectedState);
  });

  describe('fetchAllOffers', () => {
    it('should set pending loading status on "fetchAllOffers.pending" action', () => {
      const expectedState: CatalogState = {
        offers: [],
        loadingStatus: RequestStatus.Pending,
        city: CITIES[0],
        sorting: SortingOption.Default,
        activeOfferId: '',
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
        activeOfferId: '',
      };
      const mockOffers = getMockOffers(2);
      const expectedState: CatalogState = {
        offers: mockOffers,
        loadingStatus: RequestStatus.Success,
        city: CITIES[0],
        sorting: SortingOption.Default,
        activeOfferId: '',
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
        activeOfferId: '',
      };
      const expectedState: CatalogState = {
        offers: [],
        loadingStatus: RequestStatus.Error,
        city: CITIES[0],
        sorting: SortingOption.Default,
        activeOfferId: '',
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
        activeOfferId: '',
      };
      const mockTargetChangedOffer = { ...mockTargetOffer, isFavorite: true };
      const expectedState: CatalogState = {
        offers: [...mockOffers, mockTargetChangedOffer],
        loadingStatus: RequestStatus.Success,
        city: CITIES[0],
        sorting: SortingOption.Default,
        activeOfferId: '',
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
        activeOfferId: '',
      };

      expect(() => {
        catalog.reducer(initialState, changeFavoriteStatus.fulfilled(
          mockChangedOffer, '', { offerId: mockChangedOffer.id, status: FavoriteStatus.On }
        ));
      }).not.toThrow();
    });
  });
});
