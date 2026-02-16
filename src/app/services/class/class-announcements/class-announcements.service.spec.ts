import { TestBed } from '@angular/core/testing';

import { ClassAnnouncementsService } from './class-announcements.service';

describe('ClassAnnouncementsService', () => {
  let service: ClassAnnouncementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassAnnouncementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
