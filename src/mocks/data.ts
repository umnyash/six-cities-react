import { Offers, BaseOffer, CardOffer, PageOffer, CityName } from '../types/offers';
import { Author, User, AuthUser } from '../types/user';
import { Reviews, Review } from '../types/reviews';
import { faker } from '@faker-js/faker';
import { getRandomInt, getRandomArrayItem } from '../util';
import { CITIES, OFFER_PHOTOS_MAX_COUNT, HousingType } from '../const';

const MOCK_ZOOM = 13;

enum MockRating {
  Min = 1,
  Max = 5,
}

enum MockPrice {
  Min = 100,
  Max = 1000,
}

enum MockAdultsCount {
  Min = 1,
  Max = 8,
}

enum MockBedroomsCount {
  Min = 1,
  Max = 4,
}

const getRandomHousingType = () => getRandomArrayItem(Object.values(HousingType));
const getRandomRating = () => getRandomInt(MockRating.Min, MockRating.Max);
const getRamdomPrice = () => getRandomInt(MockPrice.Min, MockPrice.Max);
const getRandomCityName = () => getRandomArrayItem(CITIES);
const getRandomAdultsMaxCount = () => getRandomInt(MockAdultsCount.Min, MockAdultsCount.Max);
const getRandomBedroomsCount = () => getRandomInt(MockBedroomsCount.Min, MockBedroomsCount.Max);
const getImages = () => Array.from({ length: OFFER_PHOTOS_MAX_COUNT }, () => faker.system.filePath());
const getGoods = () => faker.lorem.words().split(' ');

const getRandomLocation = () => ({
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
  zoom: MOCK_ZOOM,
});

export const getMockCity = (cityName?: CityName) => ({
  name: cityName ?? getRandomCityName(),
  location: getRandomLocation(),
});

const getMockAuthor = (): Author => ({
  name: faker.person.fullName(),
  avatarUrl: faker.system.filePath(),
  isPro: Boolean(getRandomInt(0, 1)),
});

export const getMockUser = (): User => ({
  email: faker.internet.email(),
  ...getMockAuthor()
});

export const getMockAuthUser = (): AuthUser => ({
  token: 'secret',
  ...getMockUser()
});

const getMockBaseOffer = (): BaseOffer => ({
  id: crypto.randomUUID(),
  title: faker.lorem.words(),
  type: getRandomHousingType(),
  rating: getRandomRating(),
  price: getRamdomPrice(),
  city: getMockCity(),
  location: getRandomLocation(),
  isPremium: Boolean(getRandomInt(0, 1)),
  isFavorite: Boolean(getRandomInt(0, 1)),
});

export const getMockCardOffer = (preset: Partial<CardOffer> = {}): CardOffer => ({
  previewImage: faker.system.filePath(),
  ...getMockBaseOffer(),
  ...preset
});

export const getMockOffers = (count: number, preset: Partial<CardOffer> = {}): Offers =>
  Array.from({ length: count }, () => getMockCardOffer(preset));

export const getMockOffer = (preset: Partial<PageOffer> = {}): PageOffer => ({
  images: getImages(),
  description: faker.lorem.paragraph(),
  maxAdults: getRandomAdultsMaxCount(),
  bedrooms: getRandomBedroomsCount(),
  goods: getGoods(),
  host: getMockUser(),
  ...getMockBaseOffer(),
  ...preset
});

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
