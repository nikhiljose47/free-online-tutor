import { TestBed } from '@angular/core/testing';

import { RoadmapCacheService } from './roadmap-cache.service';

describe('RoadmapCacheService', () => {
  let service: RoadmapCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoadmapCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
