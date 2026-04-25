import { TestBed } from '@angular/core/testing';

import { GlobalMeetingsStoreService } from './global-meetings-store.service';

describe('GlobalMeetingsStoreService', () => {
  let service: GlobalMeetingsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMeetingsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
