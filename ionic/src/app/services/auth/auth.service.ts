import { Injectable } from '@angular/core';
import { CollectionConfig, FireAuthService, AtomicWrite } from 'akita-ng-fire';
import { AuthState, AuthStore } from './auth.state';
import { map, distinctUntilChanged, skip } from 'rxjs/operators';
import { firestore, User } from 'firebase/app';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'users' })
export class AuthService extends FireAuthService<AuthState> {
  public loggedIn$ = this.fireAuth.user.pipe(map(u => !!u));

  constructor(store: AuthStore, private router: Router) {
    super(store);
    this.loggedIn$
      .pipe(
        distinctUntilChanged(),
        skip(1),
      )
      .subscribe(async (loggedIn) => {
        if (loggedIn) {
          await this.router.navigateByUrl('/');
        } else {
          await this.router.navigateByUrl('/login');
        }
        console.log(loggedIn);
      });
  }

  async onCreate(profile: AuthState['profile'], write: firestore.WriteBatch) {
    await write.update(this.db.doc(`users/${this.user.uid}`).ref, {
      ...profile,
      email: this.user.email,
    });
    await write.commit();
  }
}
