import { getMockOffers } from '../../data/mocks';
import { Offers } from '../../types/offers';
import { HousingType } from '../../const';

import { groupBy } from './group-by';

describe('Function: groupBy', () => {
  const OffersCountByType = {
    [HousingType.House]: 1,
    [HousingType.Hotel]: 2,
    [HousingType.Apartment]: 3,
    [HousingType.Room]: 4,
  };

  const offers = [
    ...getMockOffers(OffersCountByType[HousingType.House], { type: HousingType.House, rating: 4 }),
    ...getMockOffers(OffersCountByType[HousingType.Hotel], { type: HousingType.Hotel, rating: 5 }),
    ...getMockOffers(OffersCountByType[HousingType.Apartment], { type: HousingType.Apartment, rating: 5 }),
    ...getMockOffers(OffersCountByType[HousingType.Room], { type: HousingType.Room, rating: 3 }),
  ];

  const backupOffers = offers.slice();

  const offersGroupedByType = groupBy(offers, (offer) => offer.type);

  it('should not modify the original array', () => {
    expect(offers).toEqual(backupOffers);
  });

  it('should return an object with 4 keys: "Apartment", "Hotel", "House", "Room"', () => {
    const expectedKeys = ['Apartment', 'Hotel', 'House', 'Room'];
    const resultKeys = Object.keys(offersGroupedByType);

    expect(offersGroupedByType).toBeInstanceOf(Object);
    expect(expectedKeys.length).toBe(resultKeys.length);
    expect(expectedKeys.sort()).toEqual(resultKeys.sort());
  });

  it('should return correct number of elements for each key', () => {
    const houseOffersCount = offersGroupedByType[HousingType.House]!.length;
    const hotelOffersCount = offersGroupedByType[HousingType.Hotel]!.length;
    const roomOffersCount = offersGroupedByType[HousingType.Room]!.length;
    const apartmentOffersCount = offersGroupedByType[HousingType.Apartment]!.length;

    expect(houseOffersCount).toBe(OffersCountByType[HousingType.House]);
    expect(hotelOffersCount).toBe(OffersCountByType[HousingType.Hotel]);
    expect(apartmentOffersCount).toBe(OffersCountByType[HousingType.Apartment]);
    expect(roomOffersCount).toBe(OffersCountByType[HousingType.Room]);
  });

  it('should return an empty object if the array was empty', () => {
    const emptyOffersArray: Offers = [];
    const expectedObject = {};

    const result = groupBy(emptyOffersArray, (offer) => offer.type);

    expect(result).toEqual(expectedObject);
  });

  it('should work with Set collections', () => {
    const offersSet = new Set(offers);

    const result = groupBy(offersSet, (offer) => offer.type);

    expect(result).toEqual(offersGroupedByType);
  });
});
