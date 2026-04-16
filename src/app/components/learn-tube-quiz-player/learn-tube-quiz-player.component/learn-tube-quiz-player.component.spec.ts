import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnTubeQuizPlayerComponent } from './learn-tube-quiz-player.component';

describe('LearnTubeQuizPlayerComponent', () => {
  let component: LearnTubeQuizPlayerComponent;
  let fixture: ComponentFixture<LearnTubeQuizPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnTubeQuizPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnTubeQuizPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
