import { Base } from '.';
import * as firebase from 'firebase/app';

export interface Asset extends Base {
  userId: string;
  locationId: string;
  type: string; // MIME type
  path: string; // storage path
  geoPoint: firebase.firestore.GeoPoint; // location during recording
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
