import { faker } from '@faker-js/faker';

const MOCK_ZOOM = 13;

const getRandomCoordinates = () => ({
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
});

export const getRandomLocation = () => ({
  zoom: MOCK_ZOOM,
  ...getRandomCoordinates()
});
