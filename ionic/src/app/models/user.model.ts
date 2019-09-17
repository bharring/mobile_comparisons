import { Base } from '.';

export interface User extends Base {
  firstName: string;
  lastName: string;
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
