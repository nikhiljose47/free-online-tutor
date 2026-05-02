import { TestBed } from '@angular/core/testing';

import { FlowPersistService } from './flow-persist.service';

describe('FlowPersistService', () => {
  let service: FlowPersistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowPersistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
