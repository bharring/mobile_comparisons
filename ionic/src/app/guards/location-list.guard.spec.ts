import { TestBed, async, inject } from '@angular/core/testing';

import { LocationListGuard } from './location-list.guard';

describe('LocationListGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationListGuard]
    });
  });

  it('should ...', inject([LocationListGuard], (guard: LocationListGuard) => {
    expect(guard).toBeTruthy();
  }));
});
