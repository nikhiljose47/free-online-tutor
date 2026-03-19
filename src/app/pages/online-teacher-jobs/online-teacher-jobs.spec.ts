import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTeacherJobs } from './online-teacher-jobs';

describe('OnlineTeacherJobs', () => {
  let component: OnlineTeacherJobs;
  let fixture: ComponentFixture<OnlineTeacherJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineTeacherJobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineTeacherJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
