import { Asset } from '../../models';
import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AssetsState, AssetsStore } from './Asset.store';

@Injectable({ providedIn: 'root' })
export class AssetsQuery extends QueryEntity<AssetsState, Asset> {
  constructor(protected store: AssetsStore) {
    super(store);
  }
}
