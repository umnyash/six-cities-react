import { Author } from './user';

export type Review = {
  id: string;
  date: string;
  user: Author;
  comment: string;
  rating: number;
}

export type Reviews = Review[];
