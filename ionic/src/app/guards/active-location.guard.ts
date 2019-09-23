import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { LocationState } from '../services/location/location.store';
import { LocationService } from '../services/location/location.service';

@Injectable({
  providedIn: 'root',
})
@CollectionGuardConfig({ awaitSync: true })
export class ActiveLocationGuard extends CollectionGuard<LocationState> {
  constructor(service: LocationService) {
    super(service);
  }

  sync(next: ActivatedRouteSnapshot) {
    return this.service.syncActive({ id: next.firstChild.params.id });
  }
}
