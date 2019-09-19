import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsQuery } from 'src/app/services/location/location.query';
import { LocationService } from 'src/app/services/location/location.service';
import { Location, Asset } from 'src/app/models';
import { Observable, Subscription } from 'rxjs';
import { ModalController, AlertController } from '@ionic/angular';
import { EditLocationComponent } from 'src/app/shared/edit-location/edit-location.component';
import { GeoService } from 'src/app/services/geo.service';
import { filter, take } from 'rxjs/operators';
import { AssetsQuery } from 'src/app/services/asset/asset.query';
import { AssetService } from 'src/app/services/asset/asset.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit, OnDestroy, AfterViewInit {
  loading$: Observable<boolean>;
  location$: Observable<Location>;
  assets$: Observable<Asset[]>;
  private locationSubscription: Subscription;
  private assetSubscription: Subscription;

  @ViewChild('mapCanvas', { static: false }) mapElement: ElementRef;
  googleMap: any;

  constructor(
    private assetsQuery: AssetsQuery,
    private assetService: AssetService,
    private alert: AlertController,
    private geo: GeoService,
    private modal: ModalController,
    private locationsQuery: LocationsQuery,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.loading$ = this.locationsQuery.selectLoading();
    this.locationSubscription = this.locationService.syncCollection().subscribe();

    this.assetSubscription = this.assetService.syncCollection(this.route.snapshot.params.id).subscribe();
    this.assets$ = this.assetsQuery.selectAll();

    this.locationService.store.setActive(this.route.snapshot.params.id);
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
        }
      });
  }

  ngOnDestroy() {
    this.locationService.store.removeActive(this.route.snapshot.params.id);
    this.assetSubscription.unsubscribe();
    this.locationSubscription.unsubscribe();
  }

  addNote() {}
  addPhoto() {}
  addAudio() {}

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
            await this.locationService.remove(this.route.snapshot.params.id);
          },
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await alert.present();
  }
}
