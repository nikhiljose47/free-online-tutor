import { TestBed } from '@angular/core/testing';

import { LearningViewState } from './learning-view-state';

describe('LearningViewState', () => {
  let service: LearningViewState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningViewState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
