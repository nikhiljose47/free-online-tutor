import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAnalytics } from './attendance-analytics';

describe('AttendanceAnalytics', () => {
  let component: AttendanceAnalytics;
  let fixture: ComponentFixture<AttendanceAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
