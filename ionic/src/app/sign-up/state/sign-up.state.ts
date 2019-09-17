import { Store, StoreConfig } from '@datorama/akita';

export interface SignUpState {
  token: string;
  name: string;
}

export function createInitialState(): SignUpState {
  return {
    token: '',
    name: '',
  };
}

@StoreConfig({ name: 'sign-up' })
export class SignUpStore extends Store<SignUpState> {
  constructor() {
    super(createInitialState());
  }
}
