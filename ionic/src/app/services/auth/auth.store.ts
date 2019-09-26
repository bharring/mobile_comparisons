import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';
import { Profile } from '../../models';

export interface AuthState {
  profile?: Profile;
  userId?: string;
  loggedIn: boolean;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth', idKey: 'docId' })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super({ loggedIn: false });
  }
}
