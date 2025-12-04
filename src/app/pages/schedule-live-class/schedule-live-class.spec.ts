import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleLiveClass } from './schedule-live-class';

describe('ScheduleLiveClass', () => {
  let component: ScheduleLiveClass;
  let fixture: ComponentFixture<ScheduleLiveClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleLiveClass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleLiveClass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
