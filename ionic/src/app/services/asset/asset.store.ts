import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { Asset } from '../../models';

import { Injectable } from '@angular/core';

export interface AssetState extends EntityState<Asset> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'assets', idKey: 'docId' })
export class AssetStore extends EntityStore<AssetState, Asset> {
  constructor() {
    super();
  }
}
