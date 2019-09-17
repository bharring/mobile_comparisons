import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignUpState } from './state/sign-up.state';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit, OnDestroy {
  constructor(private signUpService: SignUpState) {}

  ngOnInit() {}

  ngOnDestroy() {
  }
}
