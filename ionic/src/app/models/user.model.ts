import { Base } from '.';

export interface User extends Base {
  displayName: string;
  photoURL: string;
  organization: string;
}

/**
 * A factory function that creates Users
 */
export function createUser(params: Partial<User>) {
  return {
    ...params,
  } as User;
}
