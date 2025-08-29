import { faker } from '@faker-js/faker';
import { CITIES, OFFER_PHOTOS_MAX_COUNT, HousingType } from '../../const';
import { Offers, BaseOffer, CardOffer, PageOffer, CityName } from '../../types/offers';
import { getRandomInt, getRandomArrayItem } from '../../util';
import { getRandomLocation } from './location';
import { getMockUser } from './user';
import { getRandomRating } from './rating';

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
const getRamdomPrice = () => getRandomInt(MockPrice.Min, MockPrice.Max);
const getRandomCityName = () => getRandomArrayItem(CITIES);
const getRandomAdultsMaxCount = () => getRandomInt(MockAdultsCount.Min, MockAdultsCount.Max);
const getRandomBedroomsCount = () => getRandomInt(MockBedroomsCount.Min, MockBedroomsCount.Max);
const getImages = () => Array.from({ length: OFFER_PHOTOS_MAX_COUNT }, () => faker.system.filePath());
const getGoods = () => faker.lorem.words().split(' ');

export const getMockCity = (cityName?: CityName) => ({
  name: cityName ?? getRandomCityName(),
  location: getRandomLocation(),
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
