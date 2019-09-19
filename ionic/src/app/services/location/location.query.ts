import { Location } from '../../models';
import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { LocationState, LocationStore } from './location.store';

@Injectable({ providedIn: 'root' })
export class LocationsQuery extends QueryEntity<LocationState, Location> {
  constructor(protected store: LocationStore) {
    super(store);
  }
}
