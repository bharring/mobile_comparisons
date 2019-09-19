import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsQuery } from 'src/app/services/location/location.query';
import { LocationService } from 'src/app/services/location/location.service';
import { Location } from 'src/app/models';
import { Observable, Subscription } from 'rxjs';
import { ModalController, AlertController } from '@ionic/angular';
import { EditLocationComponent } from 'src/app/shared/edit-location/edit-location.component';
import { GeoService } from 'src/app/services/geo.service';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit, OnDestroy, AfterViewInit {
  loading$: Observable<boolean>;
  location$: Observable<Location>;
  private sub: Subscription;

  @ViewChild('mapCanvas', { static: false }) mapElement: ElementRef;
  googleMap: any;

  constructor(
    private alert: AlertController,
    private geo: GeoService,
    private modal: ModalController,
    private query: LocationsQuery,
    private service: LocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.loading$ = this.query.selectLoading();
    this.sub = this.service.syncCollection().subscribe();
    this.service.store.setActive(this.route.snapshot.params.id);
    this.location$ = this.query.selectActive() as Observable<Location>;
  }

  ngAfterViewInit() {
    this.location$
      .pipe(
        filter(location => !!location),
        filter(location => !!location.geoPoint),
        filter(_ => !this.googleMap), // don't redraw map
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
    this.service.store.removeActive(this.route.snapshot.params.id);
    this.sub.unsubscribe();
  }

  addNote() {}
  addPhoto() {}
  addAudio() {}

  async edit() {
    const modal = await this.modal.create({
      component: EditLocationComponent,
      componentProps: {
        location: this.query.getActive(),
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
            await this.service.remove(this.route.snapshot.params.id);
          },
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await alert.present();
  }
}
