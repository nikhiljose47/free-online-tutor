import { TestBed } from '@angular/core/testing';

import { RankboardFacadeService } from './rankboard-facade.service';

describe('RankboardFacadeService', () => {
  let service: RankboardFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RankboardFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
