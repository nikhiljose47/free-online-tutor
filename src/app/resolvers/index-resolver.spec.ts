import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { indexResolver } from './index-resolver';

describe('indexResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => indexResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
