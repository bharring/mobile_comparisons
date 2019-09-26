import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/services/location/location.service';
import { Location, Asset } from 'src/app/models';
import { Observable } from 'rxjs';
import { ModalController, AlertController } from '@ionic/angular';
import { GeoService } from 'src/app/services/geo.service';
import { filter, take, finalize } from 'rxjs/operators';
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
    private assets: AssetService,
    private alert: AlertController,
    private camera: CameraService,
    private geo: GeoService,
    private modal: ModalController,
    private locations: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
  ) {}

  async ngOnInit() {
    this.loading$ = this.locations.query.selectLoading();
    this.assets$ = this.assets.query.selectAll({
      filterBy: entity => entity.locationId === this.route.snapshot.params.id,
    });
    this.location$ = this.locations.query.selectEntity(this.route.snapshot.params.id);
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
          this.assets.query
            .getAll({
              filterBy: entity => entity.locationId === this.route.snapshot.params.id,
            })
            .map(asset => {
              const m = new mapsApi.Marker({
                position: new mapsApi.LatLng(asset.geoPoint.latitude, asset.geoPoint.longitude),
                map: this.googleMap,
                label: asset.type === 'note' ? 'N' : asset.type.startsWith('image') ? 'I' : 'A',
              });
              m.addListener('click', () => {
                if (asset.type === 'note') {
                  return this.editNote(asset);
                } else if (asset.type.startsWith('image')) {
                  return this.editPhoto(asset);
                } else if (asset.type === 'note') {
                  return this.editAudio(asset);
                }
              });
              return m;
            });
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
    const path = `/users/${this.auth.userId}/locations/${this.route.snapshot.params.id}/${Date.now()}.jpeg`;
    const percentageChanges = this.storage.upload(path, image.base64String);
    percentageChanges
      .pipe(
        finalize(async () => {
          const url = await this.storage
            .getDownloadURL(path)
            .pipe(take(1))
            .toPromise();
          this.assets.addAsset({
            type: `image/${image.format}`,
            url,
            path,
            locationId: this.route.snapshot.params.id,
          });
        }),
      )
      .subscribe();
  }
  async editAudio(asset: Asset) {
    const modal = await this.modal.create({
      component: AddAudioComponent,
      componentProps: {
        locationId: this.route.snapshot.params.id,
        asset,
      },
    });
    await modal.present();
  }

  async edit() {
    const modal = await this.modal.create({
      component: EditLocationComponent,
      componentProps: {
        location: this.locations.query.getEntity(this.route.snapshot.params.id),
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
            await this.locations.remove(this.route.snapshot.params.id);
            const assets = await this.assets$.pipe(take(1)).toPromise();
            await this.assets.delete(assets);
            await this.router.navigateByUrl('/home');
          },
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await alert.present();
  }
}
