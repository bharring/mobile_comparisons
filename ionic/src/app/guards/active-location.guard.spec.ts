import { TestBed, async, inject } from '@angular/core/testing';

import { ActiveLocationGuard } from './active-location.guard';

describe('ActiveLocationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveLocationGuard]
    });
  });

  it('should ...', inject([ActiveLocationGuard], (guard: ActiveLocationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
