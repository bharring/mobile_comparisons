import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { map, tap, switchMap, finalize, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Profile } from 'src/app/models';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthQuery } from './auth.query';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn$ = this.auth.user.pipe(map(u => !!u));
  private profile$: Observable<Profile>;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    public query: AuthQuery,
    private store: AuthStore,
    private router: Router,
  ) {
    this.auth.user.subscribe(async u => {
      if (!u) {
        this.store.reset();
        return await this.router.navigateByUrl('/login');
      }
      this.store.update({ loggedIn: true, userId: u.uid });
    });

    this.profile$ = this.userId$.pipe(
      switchMap(userId =>
        userId
          ? this.db
              .collection<Profile>('users')
              .doc<Profile>(userId)
              .valueChanges()
          : of(undefined),
      ),
    );

    this.profile$.subscribe(profile => {
      if (profile) {
        this.store.update({ profile });
      }
      this.store.setLoading(false);
    });
  }

  get userId$(): Observable<string> {
    return this.query.select(st => st.userId);
  }

  get userId(): string {
    return this.query.getValue().userId;
  }

  updateProfile(profile: Partial<Profile>) {
    this.store.setLoading(true);
    return this.db
      .collection<Profile>('users')
      .doc(this.userId)
      .set(profile, { merge: true });
  }

  async createUser(email: string, password: string) {
    this.store.setLoading(true);
    await this.auth.auth.createUserWithEmailAndPassword(email, password);
    this.store.setLoading(false);
  }

  async login(email: string, password: string) {
    this.store.setLoading(true);
    await this.auth.auth.signInWithEmailAndPassword(email, password);
    this.store.setLoading(false);
  }

  async signOut() {
    this.store.setLoading(true);
    await this.auth.auth.signOut();
    this.store.setLoading(false);
  }
}
