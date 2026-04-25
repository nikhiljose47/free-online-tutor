import { TestBed } from '@angular/core/testing';

import { UserCourseSyncService } from './user-course-sync.service';

describe('UserCourseSyncService', () => {
  let service: UserCourseSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCourseSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
