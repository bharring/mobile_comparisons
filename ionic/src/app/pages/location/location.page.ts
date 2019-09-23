import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsQuery } from 'src/app/services/location/location.query';
import { LocationService } from 'src/app/services/location/location.service';
import { Location, Asset } from 'src/app/models';
import { Observable } from 'rxjs';
import { ModalController, AlertController } from '@ionic/angular';
import { GeoService } from 'src/app/services/geo.service';
import { filter, take, finalize } from 'rxjs/operators';
import { AssetsQuery } from 'src/app/services/asset/asset.query';
import { AssetService } from 'src/app/services/asset/asset.service';
import { AddAudioComponent } from './add-audio/add-audio.component';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';
import { EditNoteComponent } from './edit-note/edit-note.component';
import { EditLocationComponent } from '../../shared/edit-location/edit-location.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EditPhotoComponent } from './edit-photo/edit-photo.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit, AfterViewInit {
  loading$: Observable<boolean>;
  location$: Observable<Location>;
  assets$: Observable<Asset[]>;

  @ViewChild('mapCanvas', { static: false }) mapElement: ElementRef;
  googleMap: any;

  constructor(
    private auth: AuthService,
    private assetsQuery: AssetsQuery,
    private assetService: AssetService,
    private alert: AlertController,
    private camera: CameraService,
    private geo: GeoService,
    private modal: ModalController,
    private locationsQuery: LocationsQuery,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
  ) {}

  async ngOnInit() {
    this.loading$ = this.locationsQuery.selectLoading();
    this.assets$ = this.assetsQuery.selectAll();
    this.location$ = this.locationsQuery.selectActive() as Observable<Location>;
  }

  ngAfterViewInit() {
    this.location$
      .pipe(
        filter(location => !!location),
        filter(location => !!location.geoPoint),
        filter(_ => !this.googleMap), // don't redraw map
        take(1),
      )
      .subscribe(async location => {
        const mapsApi = await this.geo.getGoogleMaps();
        if (mapsApi) {
          const position = new mapsApi.LatLng(location.geoPoint.latitude, location.geoPoint.longitude);
          this.googleMap = new mapsApi.Map(this.mapElement.nativeElement, { center: position, zoom: 17 });
          const marker = new mapsApi.Marker({ position, map: this.googleMap });
          // TODO add markers for other assets
        }
      });
  }

  async editNote(note?: Asset) {
    const modal = await this.modal.create({
      component: EditNoteComponent,
      componentProps: {
        locationId: this.route.snapshot.params.id,
        note,
      },
    });
    await modal.present();
  }
  async editPhoto(photo?: Asset) {
    const modal = await this.modal.create({
      component: EditPhotoComponent,
      componentProps: {
        locationId: this.route.snapshot.params.id,
        photo,
      },
    });
    await modal.present();
  }
  async addPhoto() {
    const image = await this.camera.takePicture();
    const path = `/users/${this.auth.user.uid}/locations/${this.route.snapshot.params.id}/${Date.now()}.jpeg`;
    const percentageChanges = this.storage.upload(path, image.base64String);
    percentageChanges
      .pipe(
        finalize(async () => {
          const url = await this.storage
            .getDownloadURL(path)
            .pipe(take(1))
            .toPromise();
          this.assetService.addAsset({
            type: `image/${image.format}`,
            url,
            path,
            locationId: this.route.snapshot.params.id,
          });
        }),
      )
      .subscribe();
  }
  async addAudio() {
    const modal = await this.modal.create({
      component: AddAudioComponent,
      componentProps: {
        locationId: this.route.snapshot.params.id,
      },
    });
    await modal.present();
  }

  async edit() {
    const modal = await this.modal.create({
      component: EditLocationComponent,
      componentProps: {
        location: this.locationsQuery.getActive(),
      },
    });
    await modal.present();
  }

  async delete() {
    const alert = await this.alert.create({
      message: 'Are you sure you want to delete this location?',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            await this.router.navigateByUrl('/home');
            await this.locationService.remove(this.route.snapshot.params.id, {});
            await this.assetService.removeAssetsForLocation(this.assets$);
          },
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await alert.present();
  }
}
