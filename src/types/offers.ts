import { CITIES, HousingType } from '../const';
import { Author } from './user';

export type CityName = typeof CITIES[number];

export type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
}

type Point = {
  id: string;
  location: Omit<Location, 'zoom'>;
}

type City = {
  name: CityName;
  location: Location;
}

type BaseOffer = {
  id: string;
  title: string;
  type: HousingType;
  rating: number;
  price: number;
  city: City;
  location: Location;
  isPremium: boolean;
  isFavorite: boolean;
}

export type CardOffer = BaseOffer & {
  previewImage: string;
}

export type PageOffer = BaseOffer & {
  images: string[];
  description: string;
  maxAdults: number;
  bedrooms: number;
  goods: string[];
  host: Author;
}

export type Offers = CardOffer[];

export type Points = Point[];
