import { Reviews } from '../types/reviews';

export const reviews: Reviews = [
  {
    id: crypto.randomUUID(),
    date: '2024-12-05T14:13:56.569Z',
    user: {
      name: 'Oliver Conner',
      avatarUrl: 'img/avatar-max.jpg',
    },
    comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    rating: 4,
  },
];
