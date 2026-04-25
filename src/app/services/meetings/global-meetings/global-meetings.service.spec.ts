import { TestBed } from '@angular/core/testing';

import { GlobalMeetingsService } from './global-meetings.service';

describe('GlobalMeetingsService', () => {
  let service: GlobalMeetingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMeetingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
