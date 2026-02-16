import { TestBed } from '@angular/core/testing';

import { DummyPuzzleService } from './dummy-puzzle.service';

describe('DummyPuzzleService', () => {
  let service: DummyPuzzleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DummyPuzzleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
