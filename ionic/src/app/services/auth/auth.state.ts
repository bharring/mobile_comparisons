import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { FireAuthState } from 'akita-ng-fire';
import { Profile } from '../../models';

export interface AuthState extends FireAuthState<Profile> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth', idKey: 'docId' })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super({});
  }
}
