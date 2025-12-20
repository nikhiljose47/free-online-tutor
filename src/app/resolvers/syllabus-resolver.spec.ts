import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { syllabusResolver } from './syllabus-resolver';

describe('syllabusResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => syllabusResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
