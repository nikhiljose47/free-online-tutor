import { TestBed } from '@angular/core/testing';

import { BatchDocService } from './batch-doc.service';

describe('BatchDocService', () => {
  let service: BatchDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
