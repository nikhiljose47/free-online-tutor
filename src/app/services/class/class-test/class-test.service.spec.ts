import { TestBed } from '@angular/core/testing';

import { ClassTestService } from './class-test.service';

describe('ClassTestService', () => {
  let service: ClassTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
