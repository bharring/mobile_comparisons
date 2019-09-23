import { TestBed, async, inject } from '@angular/core/testing';

import { AssetListGuard } from './asset-list.guard';

describe('AssetListGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssetListGuard]
    });
  });

  it('should ...', inject([AssetListGuard], (guard: AssetListGuard) => {
    expect(guard).toBeTruthy();
  }));
});
