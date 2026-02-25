import { TestBed } from '@angular/core/testing';

import { BatchQueryService } from './batch-query.service';

describe('BatchQueryService', () => {
  let service: BatchQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
