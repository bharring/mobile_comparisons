import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { Location } from '../../models';

import { Injectable } from '@angular/core';

export interface LocationState extends EntityState<Location> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'locations', idKey: 'docId' })
export class LocationStore extends EntityStore<LocationState, Location> {
  constructor() {
    super();
  }
}
