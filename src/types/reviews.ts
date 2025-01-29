import { Author } from './user';

export type ReviewContent = {
  comment: string;
  rating: number;
}

export type Review = ReviewContent & {
  id: string;
  date: string;
  user: Author;
}

export type Reviews = Review[];
