import { Points, Location } from '../../types/offers';

import { getRandomLocation } from './location';

const getMockPoint = (location: Location = getRandomLocation()) => ({
  id: crypto.randomUUID(),
  location: location,
});

export const getMockPoints = (count: number, location?: Location): Points =>
  Array.from({ length: count }, () => getMockPoint(location));
