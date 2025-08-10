import { getRandomInt } from '../get-random-int/get-random-int';

export const getRandomArrayItem = <T>(array: ReadonlyArray<T>) => array[getRandomInt(0, array.length - 1)];
