import { TestBed } from '@angular/core/testing';

import { DummyPuizzleServicecls } from './dummy-puizzle.servicecls';

describe('DummyPuizzleServicecls', () => {
  let service: DummyPuizzleServicecls;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DummyPuizzleServicecls);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
