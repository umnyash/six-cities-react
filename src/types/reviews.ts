import { User } from './user';

type author = Pick<User, 'name' | 'avatarUrl' | 'isPro'>;

export type Review = {
  id: string;
  date: string;
  user: author;
  comment: string;
  rating: number;
}

export type Reviews = Review[];
