import { getRandomInt } from '../../util';

enum MockRating {
  Min = 1,
  Max = 5,
}

export const getRandomRating = () => getRandomInt(MockRating.Min, MockRating.Max);
