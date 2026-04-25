import { TestBed } from '@angular/core/testing';

import { SyllabusDataService } from './syllabus-data.service';

describe('SyllabusDataService', () => {
  let service: SyllabusDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyllabusDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
