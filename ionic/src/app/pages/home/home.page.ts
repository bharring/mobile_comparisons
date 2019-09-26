import { Component, OnInit } from '@angular/core';
import { LocationsQuery } from 'src/app/services/location/location.query';
import { Observable } from 'rxjs';
import { Location } from 'src/app/models';
import { ModalController } from '@ionic/angular';
import { EditLocationComponent } from '../../shared/edit-location/edit-location.component';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loading$: Observable<boolean>;
  locations$: Observable<Location[]>;

  constructor(private modal: ModalController, private locations: LocationService) {}

  ngOnInit(): void {
    this.loading$ = this.locations.query.selectLoading();
    this.locations$ = this.locations.query.selectAll();
  }

  async addLocation() {
    const modal = await this.modal.create({
      component: EditLocationComponent,
    });
    await modal.present();
  }
}
