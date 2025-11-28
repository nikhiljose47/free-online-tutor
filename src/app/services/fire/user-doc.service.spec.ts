import { TestBed } from '@angular/core/testing';
import { UserDocService } from './user-doc.service';

describe('UserDocService', () => {
  let service: UserDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
