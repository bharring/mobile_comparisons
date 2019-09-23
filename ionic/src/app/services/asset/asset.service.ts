import { Injectable } from '@angular/core';
import { CollectionConfig, CollectionService, WriteOptions } from 'akita-ng-fire';
import { AssetState, AssetStore } from './asset.store';
import { AuthService } from '../auth/auth.service';
import { Asset } from 'src/app/models';
import { GeoService } from '../geo.service';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
@CollectionConfig({ path: 'assets', idKey: 'docId' })
export class AssetService extends CollectionService<AssetState> {
  constructor(
    private auth: AuthService,
    public store: AssetStore,
    private geo: GeoService,
    private storage: StorageService,
  ) {
    super(store);
  }

  async removeAssetsForLocation(assets$: Observable<Asset[]>) {
    assets$.subscribe(async assets => {
      for (const asset of assets) {
        await this.remove(asset.docId, {});
        if (asset.path) {
          await this.storage.delete(asset.path);
        }
      }
    });
  }

  async addAsset(entity: Partial<Asset>) {
    const pos = await this.geo.getCurrentPosition();
    const geoPoint = new firebase.firestore.GeoPoint(pos.coords.latitude, pos.coords.longitude);
    return await this.add({
      ...entity,
      userId: this.auth.user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      geoPoint,
    } as Asset);
  }

  async updateAsset(entity: Partial<Asset>) {
    return await this.update({ ...entity, updatedAt: new Date() });
  }
}
