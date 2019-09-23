import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { AssetState } from '../services/asset/asset.store';
import { AssetService } from '../services/asset/asset.service';
import { AuthService } from '../services/auth/auth.service';
import { switchMap, filter, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
@CollectionGuardConfig({ awaitSync: true })
export class AssetListGuard extends CollectionGuard<AssetState> {
  constructor(private auth: AuthService, public service: AssetService) {
    super(service);
  }

  sync(next: ActivatedRouteSnapshot) {
    return this.auth.user$.pipe(
      filter(u => !!u),
      switchMap(u =>
        this.service.syncCollection(ref =>
          ref.where('userId', '==', u.uid).where('locationId', '==', next.firstChild.params.id),
        ),
      ),
      finalize(() => {
        this.service.store.remove();
      }),
    );
  }
}
