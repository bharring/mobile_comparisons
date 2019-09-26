import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from 'src/app/models';
import { get } from 'lodash';
import { ModalController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location/location.service';
import { Observable } from 'rxjs';
import { GeoService } from 'src/app/services/geo.service';
import { firestore } from 'firebase';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss'],
})
export class EditLocationComponent implements OnInit {
  loading$: Observable<boolean>;
  @Input() location: Location;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private geo: GeoService,
    private locations: LocationService,
    private modal: ModalController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loading$ = this.locations.query.selectLoading();
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address1: ['', [Validators.required]],
      address2: [],
      city: ['', [Validators.required]],
      region: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postal: ['', []],
      geoPoint: [],
    });
    if (this.location) {
      this.form.patchValue(this.location);
    }
  }

  async fillLocation() {
    try {
      this.locations.store.setLoading(true);
      const addresses = await this.geo.getCurrentAddress();
      // console.log(addresses);

      const address: google.maps.GeocoderResult = get(
        addresses.filter(addr => addr.types.includes('route')),
        [0],
        addresses[0],
      );
      // const address = addresses[0];
      // console.log(address);

      this.form.controls.address1.setValue(
        (
          this.geo.getAddressComponent(address, 'street_number') +
          ' ' +
          this.geo.getAddressComponent(address, 'route')
        ).trim(),
      );
      this.form.controls.city.setValue(this.geo.getAddressComponent(address, 'administrative_area_level_2'));
      this.form.controls.region.setValue(this.geo.getAddressComponent(address, 'administrative_area_level_1'));
      this.form.controls.country.setValue(this.geo.getAddressComponent(address, 'country'));
      this.form.controls.postal.setValue(this.geo.getAddressComponent(address, 'postal_code'));

      this.form.controls.geoPoint.setValue(
        new firestore.GeoPoint(address.geometry.location.lat(), address.geometry.location.lng()),
      );

      if (!this.form.controls.name.value) {
        this.form.controls.name.setValue(address.formatted_address);
      }
    } catch (err) {
      console.error(err.message);
    }
    this.locations.store.setLoading(false);
  }

  async save() {
    if (this.location) {
      await this.locations.updateLocation({ ...this.location, ...this.form.value });
    } else {
      const docId = await this.locations.addLocation(this.form.value);
      await this.router.navigateByUrl(`/location/${docId}`);
    }
    this.form.reset();
    await this.modal.dismiss();
  }

  async cancel() {
    await this.modal.dismiss();
  }

  disabled() {
    return this.loading$.pipe(map(loading => !this.form.valid || loading));
  }
}
