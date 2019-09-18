import { Base } from '.';

export interface Profile extends Base {
  displayName: string;
  organizationName: string;
  photoURL: string;
  email: string;
}
