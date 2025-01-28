export const roundOffRating = (rating: number) => Math.round(rating);

export const capitalizeFirstLetter = (string: string) => `${string[0].toUpperCase()}${string.slice(1)}`;

export const getRandomInt = (from: number, to: number) => {
  const min = Math.ceil(Math.min(from, to));
  const max = Math.floor(Math.max(from, to));

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
