import { Injectable } from '@angular/core';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';
import { LocationState, LocationStore } from './location.store';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
@CollectionConfig({ path: 'locations', idKey: 'docId' })
export class LocationService extends CollectionService<LocationState> {
  constructor(private auth: AuthService, public store: LocationStore) {
    super(store);
  }

  syncCollection() {
    return super.syncCollection(ref => ref.where('userId', '==', this.auth.user.uid));
  }
}
