import { Injectable } from '@angular/core';
import { LocationStore } from './location.store';
import { AuthService } from '../auth/auth.service';
import { Location } from 'src/app/models';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LocationsQuery } from './location.query';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  basePath = 'locations';
  collection$: Observable<Location[]>;

  constructor(
    private auth: AuthService,
    public store: LocationStore,
    public query: LocationsQuery,
    private db: AngularFirestore,
  ) {
    this.collection$ = this.auth.userId$.pipe(
      switchMap(userId =>
        this.db.collection<Location>(`${this.basePath}`, ref => ref.where('userId', '==', userId)).valueChanges(),
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

  async addLocation(entity: Location) {
    this.store.setLoading(true);
    const docId = this.db.createId();
    await this.collection
      .doc(docId)
      .set({ ...entity, docId, userId: this.auth.userId, createdAt: new Date(), updatedAt: new Date() });
    return docId;
  }

  updateLocation(entity: Partial<Location>) {
    this.store.setLoading(true);
    return this.collection.doc(entity.docId).set({ ...entity, updatedAt: new Date() }, { merge: true });
  }

  remove(id: string) {
    this.store.setLoading(true);
    this.store.remove(id);
    return this.collection.doc(id).delete();
  }

  private get collection() {
    return this.db.collection<Location>(`${this.basePath}`);
  }
}
