import { getRandomArrayItem } from './get-random-array-item';

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
