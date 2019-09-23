import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationService } from 'src/app/services/location/location.service';
import { LocationsQuery } from 'src/app/services/location/location.query';
import { Subscription, Observable } from 'rxjs';
import { Location } from 'src/app/models';
import { ModalController } from '@ionic/angular';
import { EditLocationComponent } from '../../shared/edit-location/edit-location.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  locations$: Observable<Location[]>;
  private sub: Subscription;

  constructor(private service: LocationService, private query: LocationsQuery, private modal: ModalController) {}

  ngOnInit(): void {
    this.loading$ = this.query.selectLoading();
    this.locations$ = this.query.selectAll();
    this.sub = this.service.syncCollection().subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async addLocation() {
    const modal = await this.modal.create({
      component: EditLocationComponent,
    });
    await modal.present();
  }
}
