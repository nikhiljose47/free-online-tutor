import { TestBed } from '@angular/core/testing';

import { LearnTubePersistService } from './learn-tube-persist.service';

describe('LearnTubePersistService', () => {
  let service: LearnTubePersistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnTubePersistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
