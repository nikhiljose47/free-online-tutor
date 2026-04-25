import { TestBed } from '@angular/core/testing';

import { SyllabusIndexService } from './syllabus-index.service';

describe('SyllabusIndexService', () => {
  let service: SyllabusIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyllabusIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
