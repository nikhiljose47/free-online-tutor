import { TestBed } from '@angular/core/testing';
import { ClassDocService } from './class-doc';


describe('ClassDoc', () => {
  let service: ClassDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
