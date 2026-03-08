import { TestBed } from '@angular/core/testing';

import { PuzzleSesssionService } from './puzzle-sesssion.service';

describe('PuzzleSesssionService', () => {
  let service: PuzzleSesssionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuzzleSesssionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
