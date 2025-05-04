import { FavoriteStatus } from '../../const';

export const apiPaths = {
  login: () => '/login',
  logout: () => '/logout',
  offers: () => '/offers',
  offer: (id: string) => `/offers/${id}`,
  nearbyOffers: (id: string) => `/offers/${id}/nearby`,
  favorites: () => '/favorite',
  favoriteStatus: (id: string, status: FavoriteStatus) => `/favorite/${id}/${status}`,
  reviews: (id: string) => `/comments/${id}`,
} as const;
