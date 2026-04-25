import { TestBed } from '@angular/core/testing';

import { UserLeaderboardService } from './user-leaderboard.service';

describe('UserLeaderboardService', () => {
  let service: UserLeaderboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
