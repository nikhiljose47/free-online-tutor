import { TestBed } from '@angular/core/testing';

import { CatalogLookupService } from './catalog-lookup.service';

describe('CatalogLookupService', () => {
  let service: CatalogLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
