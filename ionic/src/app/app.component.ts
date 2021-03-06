import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { GeoService } from './services/geo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  loggedIn$ = this.auth.query.select(st => st.loggedIn);
  public appPages = [
    {
      title: 'Home',
      action: async () => await this.router.navigateByUrl('/'),
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
    public geo: GeoService,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      await this.geo.getGoogleMaps();
    });
  }
}
