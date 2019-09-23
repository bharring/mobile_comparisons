import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  error: string;
  loading = false;

  constructor(private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async login() {
    if (!this.disabled()) {
      try {
        this.loading = true;
        await this.auth.signin(this.form.value.email, this.form.value.password);
      } catch (err) {
        console.error(err.message);
        this.error = err.message;
      }
      this.form.reset();
      this.loading = false;
    }
  }

  disabled() {
    return !this.form.dirty || !this.form.valid || this.loading;
  }
}
