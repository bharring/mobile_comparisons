import { Injectable } from '@angular/core';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';
import { AssetState, AssetStore } from './asset.store';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
@CollectionConfig({ path: 'assets', idKey: 'docId' })
export class AssetService extends CollectionService<AssetState> {
  constructor(private auth: AuthService, public store: AssetStore) {
    super(store);
  }

  syncCollection(locationId: string) {
    return super.syncCollection(ref =>
      ref.where('userId', '==', this.auth.user.uid).where('locationId', '==', locationId),
    );
  }
}
