import { Injectable } from '@angular/core';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';
import { AssetState, AssetStore } from './asset.store';
import { AuthService } from '../auth/auth.service';
import { Asset } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
@CollectionConfig({ path: 'assets', idKey: 'docId' })
export class AssetService extends CollectionService<AssetState> {
  constructor(private auth: AuthService, public store: AssetStore) {
    super(store);
  }

  addAsset(entity: Asset) {
    return this.add({ ...entity, userId: this.auth.user.uid, createdAt: new Date(), updatedAt: new Date() });
  }

  updateAsset(entity: Partial<Asset>) {
    return this.update({ ...entity, updatedAt: new Date() });
  }

  syncAssetCollection() {
    return super.syncCollection(ref =>
      ref.where('userId', '==', this.auth.user.uid)
    );
  }
}
