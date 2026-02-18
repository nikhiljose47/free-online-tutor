import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleLiveClassForm } from './schedule-live-class-form';

describe('ScheduleLiveClassForm', () => {
  let component: ScheduleLiveClassForm;
  let fixture: ComponentFixture<ScheduleLiveClassForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleLiveClassForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleLiveClassForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
