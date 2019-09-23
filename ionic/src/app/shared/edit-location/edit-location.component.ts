import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from 'src/app/models';
import { get } from 'lodash';
import { LocationsQuery } from 'src/app/services/location/location.query';
import { ModalController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location/location.service';
import { Observable, of } from 'rxjs';
import { GeoService } from 'src/app/services/geo.service';
import { firestore } from 'firebase';
import { map } from 'rxjs/operators';

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
    private service: LocationService,
    private query: LocationsQuery,
    private modal: ModalController,
  ) {}

  ngOnInit() {
    this.loading$ = this.query.selectLoading();
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

  getAddressComponent(address: google.maps.GeocoderResult, type: string): string {
    return get(address.address_components.filter(addr => addr.types.includes(type)), [0, 'long_name'], '');
  }

  async fillLocation() {
    try {
      this.service.store.setLoading(true);
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
        (this.getAddressComponent(address, 'street_number') + ' ' + this.getAddressComponent(address, 'route')).trim(),
      );
      this.form.controls.city.setValue(this.getAddressComponent(address, 'administrative_area_level_2'));
      this.form.controls.region.setValue(this.getAddressComponent(address, 'administrative_area_level_1'));
      this.form.controls.country.setValue(this.getAddressComponent(address, 'country'));
      this.form.controls.postal.setValue(this.getAddressComponent(address, 'postal_code'));

      this.form.controls.geoPoint.setValue(
        new firestore.GeoPoint(address.geometry.location.lat(), address.geometry.location.lng()),
      );

      if (!this.form.controls.name.value) {
        this.form.controls.name.setValue(address.formatted_address);
      }
    } catch (err) {
      console.error(err.message);
    }
    this.service.store.setLoading(false);
  }

  async save() {
    this.service.store.setLoading(true);
    this.location
      ? await this.service.updateLocation({ ...this.location, ...this.form.value })
      : await this.service.addLocation(this.form.value);
    this.form.reset();
    this.service.store.setLoading(false);
    await this.modal.dismiss();
  }

  async cancel() {
    await this.modal.dismiss();
  }

  disabled() {
    return this.loading$.pipe(map(loading => !this.form.valid || loading));
  }
}
