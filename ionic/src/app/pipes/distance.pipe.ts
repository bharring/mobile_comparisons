import { Pipe, PipeTransform } from '@angular/core';
import { firestore } from 'firebase/app';

@Pipe({
  name: 'distance',
  pure: true,
})
export class DistancePipe implements PipeTransform {
  transform(geoPoint1: firestore.GeoPoint, ...args: firestore.GeoPoint[]): string {
    return geoPoint1 && args[0] ? this.getDistanceFromLatLngInKm(geoPoint1, args[0]).toFixed(1) : '';
  }

  private getDistanceFromLatLngInKm(geoPoint1: firestore.GeoPoint, geoPoint2: firestore.GeoPoint): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this._deg2rad(geoPoint2.latitude - geoPoint1.latitude); // deg2rad below
    const dLng = this._deg2rad(geoPoint2.longitude - geoPoint1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._deg2rad(geoPoint1.latitude)) *
        Math.cos(this._deg2rad(geoPoint2.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private _deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
