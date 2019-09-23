import { Injectable } from '@angular/core';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';
import { LocationState, LocationStore } from './location.store';
import { AuthService } from '../auth/auth.service';
import { Location } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
@CollectionConfig({ path: 'locations', idKey: 'docId' })
export class LocationService extends CollectionService<LocationState> {
  constructor(private auth: AuthService, public store: LocationStore) {
    super(store);
  }

  addLocation(entity: Location) {
    return this.add({ ...entity, userId: this.auth.user.uid, createdAt: new Date(), updatedAt: new Date() });
  }

  updateLocation(entity: Partial<Location>) {
    return this.update({ ...entity, updatedAt: new Date() });
  }
}
