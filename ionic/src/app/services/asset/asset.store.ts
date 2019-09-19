import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { Asset } from '../../models';

import { Injectable } from '@angular/core';

export interface AssetsState extends EntityState<Asset> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'assets' })
export class AssetsStore extends EntityStore<AssetsState, Asset> {
  constructor() {
    super();
  }
}
