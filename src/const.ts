export const APP_ROUTE_PARAM_ID = ':id';
export const REVIEWS_MAX_COUNT = 10;
export const NEARBY_OFFERS_COUNT = 3;

export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf'
] as const;

export enum AppRoute {
  Login = '/login',
  Root = '/',
  Favorites = '/favorites',
  Offer = `/offer/${APP_ROUTE_PARAM_ID}`,
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export enum HousingType {
  Apartment = 'Apartment',
  Hotel = 'Hotel',
  House = 'House',
  Room = 'Room',
}

export enum SortingOption {
  Default = 'Popular',
  PriceAsc = 'Price: low to high',
  PriceDesc = 'Price: high to low',
  RatingDesc = 'Top rated first',
}

export enum APIRoute {
  Login = '/login',
  Logout = '/logout',
  Offers = '/offers',
  Favorites = '/favorite',
  Reviews = '/comments',
}
