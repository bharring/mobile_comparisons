import { Base } from '.';
import { firestore } from 'firebase/app';

export interface Asset extends Base {
  userId: string;
  locationId: string;
  type: string; // MIME type
  path: string; // storage path
  url: string; // download path
  geoPoint: firestore.GeoPoint; // location during recording

  subject?: string; // test notes only:
  text?: string; // test notes only:
}

/**
 * A factory function that creates Assets
 */
export function createAsset(params: Partial<Asset>) {
  return {
    ...params,
  } as Asset;
}
