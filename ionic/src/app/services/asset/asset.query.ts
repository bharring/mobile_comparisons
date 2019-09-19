import { Asset } from '../../models';
import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AssetState, AssetStore } from './asset.store';

@Injectable({ providedIn: 'root' })
export class AssetsQuery extends QueryEntity<AssetState, Asset> {
  constructor(protected store: AssetStore) {
    super(store);
  }
}
