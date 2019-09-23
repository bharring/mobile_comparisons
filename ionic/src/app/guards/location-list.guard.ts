import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CollectionGuard } from 'akita-ng-fire';
import { LocationState } from '../services/location/location.store';
import { LocationService } from '../services/location/location.service';
import { AuthService } from '../services/auth/auth.service';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationListGuard extends CollectionGuard<LocationState> {
  constructor(private auth: AuthService, service: LocationService) {
    super(service);
  }

  sync(next: ActivatedRouteSnapshot) {
    return this.auth.user$.pipe(
      filter(u => !!u),
      switchMap(u => this.service.syncCollection(ref => ref.where('userId', '==', u.uid))),
    );
  }
}
