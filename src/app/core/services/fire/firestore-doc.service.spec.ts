import { TestBed } from '@angular/core/testing';

import { FirestoreDocService } from './firestore-doc.service';

describe('FirestoreDocService', () => {
  let service: FirestoreDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
