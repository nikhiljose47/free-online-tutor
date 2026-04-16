import { TestBed } from '@angular/core/testing';

import { LearntubeFetchService } from './learntube-fetch.service';

describe('LearntubeFetchService', () => {
  let service: LearntubeFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearntubeFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
