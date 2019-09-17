import { Base } from '.';
import { firestore } from 'firebase/app';

export interface Asset extends Base {
  userId: string;
  locationId: string;
  type: string; // MIME type
  path: string; // storage path
  geoPoint: firestore.GeoPoint; // location during recording
  // EXIF and similar data:

}

/**
 * A factory function that creates Assets
 */
export function createAsset(params: Partial<Asset>) {
  return {
    ...params,
  } as Asset;
}
