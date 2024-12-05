import { User } from './user';

type author = Pick<User, 'name' | 'avatarUrl'>;

export type Review = {
  id: string;
  date: string;
  user: author;
  comment: string;
  rating: number;
}

export type Reviews = Review[];
