export const APP_ROUTE_PARAM_ID = ':id';
export const OFFER_PHOTOS_MAX_COUNT = 6;
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
  Root = '/',
  Login = '/login',
  Favorites = '/favorites',
  Offer = `/offer/${APP_ROUTE_PARAM_ID}`,
}

export enum PageTitle {
  Root = '6 cities',
  Login = '6 cities: authorization',
  Favorites = '6 cities: favorites',
  Offer = '6 cities: offer',
  NotFound = '6 cities: page not found',
}

export enum RequestStatus {
  None = 'None',
  Pending = 'Pending',
  Success = 'Success',
  Error = 'Error',
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

export enum NameSpace {
  User = 'USER',
  Offers = 'OFFERS',
  Favorites = 'FAVORITES',
  Reviews = 'REVIEWS',
  Catalog = 'CATALOG',
}

export enum FavoriteStatus {
  Off = 0,
  On = 1,
}
