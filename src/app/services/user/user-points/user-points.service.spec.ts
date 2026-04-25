import { TestBed } from '@angular/core/testing';

import { UserPointsService } from './user-points.service';

describe('UserPointsService', () => {
  let service: UserPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
