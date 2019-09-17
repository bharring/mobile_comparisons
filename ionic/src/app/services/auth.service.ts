import { Injectable } from '@angular/core';
import { CollectionConfig, FireAuthService } from 'akita-ng-fire';
import { AuthState, AuthStore } from '../states/auth.state';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'users' })
export class AuthService extends FireAuthService<AuthState> {
  loggedIn$ = this.fireAuth.user.pipe(map(u => !!u));
  constructor(store: AuthStore) {
    super(store);
  }
}
