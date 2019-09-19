import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationService } from 'src/app/services/location/location.service';
import { LocationsQuery } from 'src/app/services/location/location.query';
import { Subscription, Observable } from 'rxjs';
import { Location } from 'src/app/models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private sub: Subscription;
  locations$: Observable<Location[]>;

  constructor(private service: LocationService, private query: LocationsQuery) {}

  ngOnInit(): void {
    this.sub = this.service.syncCollection().subscribe();
    this.locations$ = this.query.selectAll();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  add() {
    // this.service.add({  });
  }
}
