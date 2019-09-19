import { Location } from '../../models';
import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { LocationsState, LocationsStore } from './location.store';

@Injectable({ providedIn: 'root' })
export class LocationsQuery extends QueryEntity<LocationsState, Location> {
  constructor(protected store: LocationsStore) {
    super(store);
  }
}
