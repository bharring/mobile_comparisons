import { Base } from '.';
import { firestore } from 'firebase/app';

export interface Location extends Base {
  userId: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  country: string;
  postal: string;
  geoPoint: firestore.GeoPoint; // location during recording
}

/**
 * A factory function that creates Locations
 */
export function createLocation(params: Partial<Location>) {
  return {
    ...params,
  } as Location;
}
