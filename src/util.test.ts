import {
  roundOffRating,
  capitalizeFirstLetter,
  normalizeIntRange,
  getRandomInt,
  getUniqueRandomInts,
  getRandomArrayItem,
  removeArrayItem,
  groupBy,
  omit,
} from './util';

import { getMockOffers } from './mocks/util';
import { Offers } from './types/offers';
import { HousingType } from './const';

describe('Util functions', () => {
  describe('Function: roundOffRating', () => {
    it('should round down ratings with a fractional part below 0.5', () => {
      expect(roundOffRating(3.1)).toBe(3);
      expect(roundOffRating(3.4)).toBe(3);
    });

    it('should round up ratings with a fractional part of 0.5 or higher', () => {
      expect(roundOffRating(3.5)).toBe(4);
      expect(roundOffRating(3.9)).toBe(4);
    });
  });

  describe('Function: capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a lowercase word', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
    });

    it('should not change an already capitalized word', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello');
      expect(capitalizeFirstLetter('World')).toBe('World');
    });
  });

  describe('Function: normalizeIntRange', () => {
    it('should return an array with 2 elements', () => {
      const from = 1;
      const to = 10;

      const result = normalizeIntRange(from, to);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
    });

    it('should return an array with 2 elements, sorted in ascending order', () => {
      expect(normalizeIntRange(1, 10)).toEqual([1, 10]);
      expect(normalizeIntRange(10, 1)).toEqual([1, 10]);
      expect(normalizeIntRange(-10, -1)).toEqual([-10, -1]);
      expect(normalizeIntRange(-1, -10)).toEqual([-10, -1]);
    });

    it('should round up the smaller of the two arguments', () => {
      expect(normalizeIntRange(1.1, 10)[0]).toBe(2);
      expect(normalizeIntRange(10, 1.5)[0]).toBe(2);
      expect(normalizeIntRange(1.9, 10)[0]).toBe(2);
    });

    it('should round down the larger of the two arguments', () => {
      expect(normalizeIntRange(1, 9.1)[1]).toBe(9);
      expect(normalizeIntRange(1, 9.5)[1]).toBe(9);
      expect(normalizeIntRange(9.9, 1)[1]).toBe(9);
    });

    it('should throw an error if there are no integers in the passed range', () => {
      expect(() => normalizeIntRange(1.1, 1.9)).toThrow();
    });
  });

  describe('Function: getRandomInt', () => {
    const FROM = -5;
    const TO = 5;
    const RANGE_LENGTH = 11; // -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5
    const randomNumbers = Array.from({ length: 100 }, () => getRandomInt(FROM, TO));

    it('should return integers', () => {
      const isAllNumbersIntegers = randomNumbers.every((number) => Number.isInteger(number));

      expect(isAllNumbersIntegers).toBe(true);
    });

    it('should return numbers within a range', () => {
      const min = Math.min(FROM, TO);
      const max = Math.max(FROM, TO);

      const isAllNumbersWithinRange = randomNumbers.every((number) => number >= min && number <= max);

      expect(isAllNumbersWithinRange).toBe(true);
    });

    it('should return every possible number at least once, when called multiple times and in a small range', () => {
      const uniqueNubmbersCount = new Set(randomNumbers).size;

      expect(uniqueNubmbersCount).toBe(RANGE_LENGTH);
    });
  });

  describe('Function: getUniqueRandomInts', () => {
    const FROM = 1;
    const TO = 12;
    const RANGE_LENGTH = 12; // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
    const REQUESTED_INTS_SOME_CORRECT_COUNT = 9;

    const result1 = getUniqueRandomInts({ from: FROM, to: TO }, REQUESTED_INTS_SOME_CORRECT_COUNT);

    it('should return an array with 9 elements', () => {
      expect(result1).toBeInstanceOf(Array);
      expect(result1).toHaveLength(REQUESTED_INTS_SOME_CORRECT_COUNT);
    });

    it('should return an array of unique numbers with 9 elements', () => {
      const uniqueNubmbersCount = new Set(result1).size;

      expect(uniqueNubmbersCount).toBe(REQUESTED_INTS_SOME_CORRECT_COUNT);
    });

    it('should return arrays with different numbers when called multiple times, but that\'s not certain', () => {
      const result2 = getUniqueRandomInts({ from: FROM, to: TO }, REQUESTED_INTS_SOME_CORRECT_COUNT);
      const result3 = getUniqueRandomInts({ from: FROM, to: TO }, REQUESTED_INTS_SOME_CORRECT_COUNT);

      expect(result1).not.toEqual(result2);
      expect(result1).not.toEqual(result3);
      expect(result2).not.toEqual(result3);
    });

    it('should throw an error if the range contains fewer integers than requested', () => {
      const requestedIntsIncorrectCount = RANGE_LENGTH + 1;

      expect(() => getUniqueRandomInts({ from: FROM, to: TO }, requestedIntsIncorrectCount)).toThrow();
    });
  });

  describe('Function: getRandomArrayItem', () => {
    const someArray = ['🍎', '🍌', '🍉', '🍇', '🍒'];
    const randomItems = Array.from({ length: 100 }, () => getRandomArrayItem(someArray));

    it('should return an element from the array', () => {
      const isAllItemsFromArray = randomItems.every((item) => someArray.includes(item));

      expect(isAllItemsFromArray).toBe(true);
    });

    it('should return every item from the array at least once, when called multiple times', () => {
      const uniqueItemsCount = new Set(randomItems).size;

      expect(uniqueItemsCount).toBe(someArray.length);
    });

    it('should return undefined if the array is empty', () => {
      const emptyArray: string[] = [];

      const result = getRandomArrayItem(emptyArray);

      expect(result).toBeUndefined();
    });

    it('should not modify the original array', () => {
      const sourceArray = ['🍎', '🍌', '🍉', '🍇', '🍒'];
      const copyArray = sourceArray.slice();

      getRandomArrayItem(copyArray);

      expect(copyArray).toEqual(sourceArray);
    });
  });

  describe('Function: removeArrayItem', () => {
    it('should remove a primitive value from the array', () => {
      const initialArray = ['🍎', '🍌', '🍉', '🍇', '🍒'];
      const expectedArray = ['🍎', '🍌', '🍉', '🍒'];

      removeArrayItem(initialArray, '🍇');

      expect(initialArray).toEqual(expectedArray);
    });

    it('should modify the original array', () => {
      const initialArray = ['🍎', '🍌', '🍉', '🍇', '🍒'];
      const copyArray = initialArray.slice();

      removeArrayItem(copyArray, '🍇');

      expect(copyArray).not.toEqual(initialArray);
    });

    it('should revome an object from the array if the keys match completely or partially', () => {
      const initialArray = [
        { id: '1', name: 'Cecil' },
        { id: '2', name: 'Perry' },
        { id: '3', name: 'Tom' },
        { id: '4', name: 'Connor' },
        { id: '5', name: 'Reed' },
      ];
      const expectedArray = [
        { id: '1', name: 'Cecil' },
        { id: '5', name: 'Reed' },
      ];

      removeArrayItem(initialArray, { id: '2', name: 'Perry' });
      removeArrayItem(initialArray, { id: '3' });
      removeArrayItem(initialArray, { name: 'Connor' });

      expect(initialArray).toEqual(expectedArray);
    });

    it('should throw an error if the element to remove is not found in the array', () => {
      const initialArray1 = ['🍎', '🍌', '🍉', '🍇', '🍒'];
      const initialArray2 = [
        { id: '1', name: 'Cecil' },
        { id: '2', name: 'Perry' },
        { id: '3', name: 'Tom' },
        { id: '4', name: 'Connor' },
        { id: '5', name: 'Reed' },
      ];

      expect(() => removeArrayItem(initialArray1, '🥦')).toThrow();
      expect(() => removeArrayItem(initialArray2, { id: '100' })).toThrow();
    });
  });

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

  describe('Function: omit', () => {
    it('should return a new object without the passed keys', () => {
      const initialObject = {
        avatar: 'photo.jpg',
        email: 'test@test.com',
        isPro: false,
        password: 'abc123',
        token: 'secret',
      };
      const expectedObject = {
        avatar: 'photo.jpg',
        isPro: false,
      };

      const result = omit(initialObject, 'email', 'password', 'token');

      expect(result).toEqual(expectedObject);
    });

    it('should not modify initial object', () => {
      const initialObject = {
        avatar: 'photo.jpg',
        email: 'test@test.com',
        isPro: false,
        password: 'abc123',
        token: 'secret',
      };
      const expectedObject = { ...initialObject };

      omit(initialObject, 'email', 'password', 'token');

      expect(initialObject).toEqual(expectedObject);
    });
  });
});
