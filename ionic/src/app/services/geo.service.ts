import { Injectable } from '@angular/core';
import { Plugins, GeolocationPosition } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

const { Geolocation } = Plugins;

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  googleMaps: any;

  private _geocoder: google.maps.Geocoder;
  get geocoder(): google.maps.Geocoder {
    if (this.googleMaps && !this._geocoder) {
      this._geocoder = new this.googleMaps.Geocoder();
    }
    return this._geocoder;
  }

  constructor(private toast: ToastController) {
    this.getGoogleMaps().then(googleMaps => (this.googleMaps = googleMaps));
  }

  async getCurrentPosition(): Promise<GeolocationPosition> {
    try {
      return await Geolocation.getCurrentPosition();
    } catch (err) {
      console.error(err.message);
      const toast = await this.toast.create({ color: 'danger', message: err.message });
      await toast.present();
      throw new Error(err.message);
    }
  }

  async getCurrentAddress(): Promise<google.maps.GeocoderResult[]> {
    this.googleMaps = await this.getGoogleMaps();
    const coordinates = await this.getCurrentPosition();
    return new Promise(async (resolve, reject) => {
      if (!this.geocoder) {
        return reject('Google maps not found');
      }
      this.geocoder.geocode(
        { location: { lat: coordinates.coords.latitude, lng: coordinates.coords.longitude } },
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === google.maps.GeocoderStatus.OK) {
            resolve(results);
          }
          reject(`Google maps error: ${status}`);
        },
      );
    });
  }

  // watchPosition() {
  //   const wait = Geolocation.watchPosition({}, (position, err) => {});
  // }

  getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&v=3.37`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const googleModule2 = win.google;
        if (googleModule2 && googleModule2.maps) {
          resolve(googleModule2.maps);
        } else {
          reject('google maps not available');
        }
      };
    });
  }
}
