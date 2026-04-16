import { TestBed } from '@angular/core/testing';

import { LearnTubeService } from './learn-tube.service';

describe('LearnTubeService', () => {
  let service: LearnTubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnTubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
