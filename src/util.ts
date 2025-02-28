export const roundOffRating = (rating: number) => Math.round(rating);

export const capitalizeFirstLetter = (string: string) => `${string[0].toUpperCase()}${string.slice(1)}`;

export const getRandomInt = (from: number, to: number) => {
  const min = Math.ceil(Math.min(from, to));
  const max = Math.floor(Math.max(from, to));

  if (min > max) {
    throw new Error(`There are no integers in the provided range from ${from} to ${to}.`);
  }

  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

export const getRandomArrayItems = <T>(array: T[], count: number): T[] => {
  if (count >= array.length) {
    return array;
  }

  const set: Set<T> = new Set();

  while (set.size < count) {
    set.add(array[getRandomInt(0, array.length - 1)]);
  }

  return Array.from(set);
};

export const removeArrayItem = <T>(array: Array<T>, removedItem: T | Partial<T>) => {
  let removedItemIndex: number;

  if (typeof removedItem !== 'object' || removedItem === null) {
    removedItemIndex = array.findIndex((item) => item === removedItem);
  } else {
    const removedItemKeys = Object.keys(removedItem) as Array<keyof T>;

    removedItemIndex = array.findIndex((item) =>
      removedItemKeys.every((key) => item[key] === removedItem[key])
    );
  }

  if (removedItemIndex === -1) {
    throw new Error('Item not found in array.');
  }

  array.splice(removedItemIndex, 1);
};

export const groupBy = <K extends PropertyKey, T>(items: Iterable<T>, getKey: (item: T) => K) =>
  Array.from(items).reduce(
    (result: Partial<Record<K, T[]>>, item) => {
      const key = getKey(item);

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(item);

      return result;
    },
    {}
  );
