import { TestBed } from '@angular/core/testing';
import { GlobalMeetingsViewModel } from './global-meetings-viewmodel';


describe('GlobalMeetingsViewModel', () => {
  let service: GlobalMeetingsViewModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMeetingsViewModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
