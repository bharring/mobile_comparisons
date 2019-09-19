import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { Location } from '../../models';

import { Injectable } from '@angular/core';

export interface LocationsState extends EntityState<Location> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'locations' })
export class LocationsStore extends EntityStore<LocationsState, Location> {
  constructor() {
    super();
  }
}
