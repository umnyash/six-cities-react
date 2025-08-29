import { faker } from '@faker-js/faker';
import { Author, User, AuthUser } from '../../types/user';
import { getRandomInt } from '../../util';

export const getMockAuthor = (preset: Partial<Author> = {}): Author => ({
  name: faker.person.fullName(),
  avatarUrl: faker.system.filePath(),
  isPro: Boolean(getRandomInt(0, 1)),
  ...preset
});

export const getMockUser = (): User => ({
  email: faker.internet.email(),
  ...getMockAuthor()
});

export const getMockAuthUser = (): AuthUser => ({
  token: 'secret',
  ...getMockUser()
});
