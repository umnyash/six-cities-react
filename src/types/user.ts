export type User = {
  name: string;
  email: string;
  avatarUrl: string;
  isPro: boolean;
}

export type Host = Pick<User, 'name' | 'avatarUrl' | 'isPro'>;

export type AuthData = {
  email: string;
  password: string;
}

export type AuthUser = User & {
  token: string;
}
