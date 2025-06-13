import { NameSpace, RequestStatus, CITIES, SortingOption } from '../../const';
import { getMockOffers, getMockCity } from '../../mocks/data';

import {
  getAllOffers,
  getAllOffersLoadingStatus,
  getCity,
  getSorting,
  getAllOffersGroupedByCity,
  getAllOffersByCity,
  getSortedAllOffersByCity,
} from './catalog.selectors';

describe('Catalog selectors', () => {
  const nameSpace = NameSpace.Catalog;
  const activeCity = CITIES[0];

  const mockOffersForActiveCity = getMockOffers(4, {
    city: getMockCity(activeCity)
  });

  const mockAllOffers = [...mockOffersForActiveCity, ...getMockOffers(12)];

  const state = {
    [nameSpace]: {
      offers: mockAllOffers,
      loadingStatus: RequestStatus.Success,
      city: activeCity,
      sorting: SortingOption.Default,
    }
  };

  describe('Simple selectors', () => {
    it('should return offers from state', () => {
      const { offers } = state[nameSpace];
      const result = getAllOffers(state);
      expect(result).toEqual(offers);
    });

    it('should return offers loading status from state', () => {
      const { loadingStatus } = state[nameSpace];
      const result = getAllOffersLoadingStatus(state);
      expect(result).toBe(loadingStatus);
    });

    it('should return city from state', () => {
      const { city } = state[nameSpace];
      const result = getCity(state);
      expect(result).toBe(city);
    });

    it('should return sorting from state', () => {
      const { sorting } = state[nameSpace];
      const result = getSorting(state);
      expect(result).toBe(sorting);
    });
  });

  describe('Combined selectors', () => {
    describe('should return all offers grouped by city from state', () => {
      const result = getAllOffersGroupedByCity(state);

      it('should return an object whose keys are the names of cities', () => {
        const expectedKeys = Array.from(new Set(mockAllOffers.map((offer) => offer.city.name)));
        const resultKeys = Object.keys(result);

        expect(result).toBeInstanceOf(Object);
        expect(resultKeys.sort()).toEqual(expectedKeys.sort());
      });

      it('should return an object with offers corresponding to the original ones', () => {
        const resultOffers = Object.values(result).flat();

        expect(resultOffers).toEqual(expect.arrayContaining(mockAllOffers));
        expect(mockAllOffers).toEqual(expect.arrayContaining(resultOffers));
      });
    });

    it('should return all offers by city from state', () => {
      const expectedOffers = mockAllOffers.filter((offer) => offer.city.name === activeCity);
      const resultOffers = getAllOffersByCity(state);
      expect(resultOffers).toEqual(expectedOffers);
    });

    describe('should return sorted all offers by city from state', () => {
      const allOffersByCity = mockAllOffers.filter((offer) => offer.city.name === activeCity);

      it('should return offers sorted by price ascending', () => {
        const expectedOffers = allOffersByCity.toSorted((a, b) => a.price - b.price);

        const resultOffers = getSortedAllOffersByCity({
          [nameSpace]: { ...state[nameSpace], sorting: SortingOption.PriceAsc }
        });

        expect(resultOffers).toEqual(expectedOffers);
      });

      it('should return offers sorted by price descending', () => {
        const expectedOffers = allOffersByCity.toSorted((a, b) => b.price - a.price);

        const resultOffers = getSortedAllOffersByCity({
          [nameSpace]: { ...state[nameSpace], sorting: SortingOption.PriceDesc }
        });

        expect(resultOffers).toEqual(expectedOffers);
      });

      it('should return offers sorted by rating descending', () => {
        const expectedOffers = allOffersByCity.toSorted((a, b) => b.rating - a.rating);

        const resultOffers = getSortedAllOffersByCity({
          [nameSpace]: { ...state[nameSpace], sorting: SortingOption.RatingDesc }
        });

        expect(resultOffers).toEqual(expectedOffers);
      });

      it('should return unsorted offers', () => {
        const resultOffers = getSortedAllOffersByCity({
          [nameSpace]: { ...state[nameSpace], sorting: SortingOption.Default }
        });

        expect(resultOffers).toEqual(allOffersByCity);
      });
    });
  });
});
