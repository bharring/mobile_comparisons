import { Query } from '@datorama/akita';
import { SignUpState, SignUpStore } from './sign-up.state';

export class SignUpQuery extends Query<SignUpState> {
  isLoggedIn$ = this.select((state) => !!state.token);
  selectName$ = this.select('name');
  // multi$ = this.select(['name', 'age']); // { name, age }
  // multi$ = this.select[((state) => state.name, (state) => state.age)]; // [name, age]

  constructor(protected store: SignUpStore) {
    super(store);
  }
}
