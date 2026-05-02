import { TestBed } from '@angular/core/testing';

import { RankboardCacheService } from './rankboard-cache.service';

describe('RankboardCacheService', () => {
  let service: RankboardCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RankboardCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
