import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnTubeComponent } from './learn-tube.component';

describe('LearnTubeComponent', () => {
  let component: LearnTubeComponent;
  let fixture: ComponentFixture<LearnTubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnTubeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnTubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
