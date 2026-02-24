import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassScheduleList } from './class-schedule-list';

describe('ClassScheduleList', () => {
  let component: ClassScheduleList;
  let fixture: ComponentFixture<ClassScheduleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassScheduleList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassScheduleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
