import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnTubeDashboard } from './learn-tube-dashboard';

describe('LearnTubeDashboard', () => {
  let component: LearnTubeDashboard;
  let fixture: ComponentFixture<LearnTubeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnTubeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnTubeDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
