import { faker } from '@faker-js/faker';
import { Reviews, Review } from '../../types/reviews';

import { getRandomRating } from './rating';
import { getMockAuthor } from './user';

export const getMockReview = (preset: Partial<Review> = {}): Review => ({
  id: crypto.randomUUID(),
  date: faker.date.past().toISOString(),
  rating: getRandomRating(),
  comment: faker.lorem.paragraph(),
  user: getMockAuthor(),
  ...preset
});

export const getMockReviews = (count: number): Reviews =>
  Array.from({ length: count }, () => getMockReview());
