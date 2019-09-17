import { SignUpStore } from './sign-up.state';

export class SignUpService {
  constructor(private signUpStore: SignUpStore) {}

  updateUserName(newName: string) {
    this.signUpStore.update((state) => ({
      name: newName,
    }));
  }
}
