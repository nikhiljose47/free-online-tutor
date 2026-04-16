import { TestBed } from '@angular/core/testing';

import { AiLearnService } from './ai-learn.service';

describe('AiLearnService', () => {
  let service: AiLearnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiLearnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
