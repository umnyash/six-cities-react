import { Offers } from '../types/offers';
import { Cities, HousingType } from '../const';

export const offers: Offers = [
  {
    id: crypto.randomUUID(),
    title: 'Tile House',
    previewImage: 'img/apartment-01.jpg',
    type: HousingType.House,
    rating: 1.6,
    price: 148,
    city: {
      name: Cities[0],
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13
      }
    },
    location: {
      latitude: 48.868610000000004,
      longitude: 2.342499,
      zoom: 16
    },
    isPremium: true,
    isFavorite: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Waterfront with extraordinary view',
    previewImage: 'img/apartment-02.jpg',
    type: HousingType.Apartment,
    rating: 4.8,
    price: 146,
    city: {
      name: Cities[1],
      location: {
        latitude: 50.938361,
        longitude: 6.959974,
        zoom: 13
      }
    },
    location: {
      latitude: 50.932361,
      longitude: 6.937974,
      zoom: 16
    },
    isPremium: true,
    isFavorite: true,
  },
  {
    id: crypto.randomUUID(),
    title: 'Perfectly located Castro',
    previewImage: 'img/apartment-03.jpg',
    type: HousingType.Room,
    rating: 4.1,
    price: 531,
    city: {
      name: Cities[3],
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    },
    location: {
      latitude: 52.37454,
      longitude: 4.881976,
      zoom: 16
    },
    isPremium: false,
    isFavorite: true,
  },
  {
    id: crypto.randomUUID(),
    title: 'Amazing and Extremely Central Flat',
    previewImage: 'img/room.jpg',
    type: HousingType.Hotel,
    rating: 2.3,
    price: 339,
    city: {
      name: Cities[3],
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    },
    location: {
      latitude: 52.37854,
      longitude: 4.894976,
      zoom: 16
    },
    isPremium: false,
    isFavorite: false,
  },
];
