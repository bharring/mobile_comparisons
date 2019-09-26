import { Injectable } from '@angular/core';
import { AssetStore } from './asset.store';
import { AuthService } from '../auth/auth.service';
import { Asset } from 'src/app/models';
import { GeoService } from '../geo.service';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { StorageService } from '../storage.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { AssetsQuery } from './asset.query';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  basePath = 'assets';
  collection$: Observable<Asset[]>;

  constructor(
    private auth: AuthService,
    private db: AngularFirestore,
    public store: AssetStore,
    private geo: GeoService,
    public query: AssetsQuery,
    private storage: StorageService,
  ) {
    this.collection$ = this.auth.userId$.pipe(
      switchMap(userId =>
        this.db.collection<Asset>(`${this.basePath}`, ref => ref.where('userId', '==', userId)).valueChanges(),
      ),
    );

    this.collection$.subscribe(
      entities => {
        this.store.upsertMany(entities);
        this.store.setLoading(false);
      },
      err => {
        this.store.setError(err.message);
        this.store.set([]);
      },
    );
  }

  async delete(assets: Asset[] | Asset) {
    const arr = Array.isArray(assets) ? assets : [assets];
    this.store.setLoading(true);
    if (arr.length === 0) {
      return;
    }
    const docs = Promise.all(
      arr.map(asset => {
        this.collection.doc(asset.docId).delete();
      }),
    );
    const blobs = Promise.all(
      arr
        .filter(asset => asset.path)
        .map(asset => {
          this.storage.delete(asset.path);
        }),
    );
    await [blobs, docs];
    this.store.remove(arr.map(asset => asset.docId));
  }

  async addAsset(entity: Partial<Asset>) {
    this.store.setLoading(true);
    const pos = await this.geo.getCurrentPosition();
    const geoPoint = new firebase.firestore.GeoPoint(pos.coords.latitude, pos.coords.longitude);
    const docId = this.db.createId();
    await this.collection
      .doc(docId)
      .set({ ...entity, docId, geoPoint, userId: this.auth.userId, createdAt: new Date(), updatedAt: new Date() });
    return docId;
  }

  async updateAsset(entity: Partial<Asset>) {
    this.store.setLoading(true);
    return this.collection.doc(entity.docId).set({ ...entity, updatedAt: new Date() }, { merge: true });
  }

  private get collection() {
    return this.db.collection<Location>(`${this.basePath}`);
  }
}
