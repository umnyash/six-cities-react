import { Cities, HousingType } from '../const';
import { User } from './user';

type CityName = typeof Cities[number];

type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
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

type Host = Pick<User, 'name' | 'avatarUrl' | 'isPro'>;

export type CardOffer = BaseOffer & {
  previewImage: string;
}

export type PageOffer = BaseOffer & {
  images: string[];
  description: string;
  maxAdults: number;
  bedrooms: number;
  goods: string[];
  host: Host;
}

export type Offers = CardOffer[];