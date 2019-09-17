import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { FireAuthState } from 'akita-ng-fire';

export interface Profile {
  displayName: string;
  photoURL: string;
}

export interface AuthState extends FireAuthState<Profile> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth', idKey: 'docId' })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super({});
  }
}
