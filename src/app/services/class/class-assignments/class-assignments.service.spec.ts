import { TestBed } from '@angular/core/testing';

import { ClassAssignmentsService } from './class-assignments.service';

describe('ClassAssignmentsService', () => {
  let service: ClassAssignmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassAssignmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
