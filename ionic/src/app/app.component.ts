import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      action: async () => await this.router.navigateByUrl('/home'),
      icon: 'home',
      loggedIn: true,
    },
    {
      title: 'Log In',
      action: async () => await this.router.navigateByUrl('/login'),
      icon: 'log-in',
      loggedIn: false,
    },
    {
      title: 'Sign Up',
      action: async () => await this.router.navigateByUrl('/sign-up'),
      icon: 'person-add',
      loggedIn: false,
    },
    {
      title: 'Profile',
      action: async () => await this.router.navigateByUrl('/profile'),
      icon: 'contact',
      loggedIn: true,
    },
    {
      title: 'Sign Out',
      action: async () => await this.auth.signOut(),
      icon: 'log-out',
      loggedIn: true,
    },
  ];

  constructor(
    public auth: AuthService,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
