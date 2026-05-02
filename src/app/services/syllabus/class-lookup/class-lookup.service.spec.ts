import { TestBed } from '@angular/core/testing';

import { ClassLookupService } from './class-lookup.service';

describe('ClassLookupService', () => {
  let service: ClassLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
