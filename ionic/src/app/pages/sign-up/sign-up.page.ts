import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form: FormGroup;
  error: string;
  loading = false;

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        displayName: ['', Validators.required],
        organizationName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validator: (group: FormGroup) =>
          group.controls.password.value === group.controls.passwordConfirm.value ? null : { notSame: true },
      },
    );
  }

  async signup() {
    if (!this.disabled()) {
      try {
        this.loading = true;
        await this.auth.signup(this.form.value.email, this.form.value.password);
        await this.auth.update({
          displayName: this.form.value.displayName,
          organizationName: this.form.value.organizationName,
        });
      } catch (err) {
        console.error(err.message);
        this.error = err.message;
      }
      // Workaround for Akita bug, always throws on signup ಥ_ಥ
      this.form.reset();
      this.loading = false;
    }
  }

  disabled() {
    return !this.form.dirty || !this.form.valid || this.loading;
  }
}
