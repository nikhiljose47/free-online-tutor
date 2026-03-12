import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLeaderboardWidget } from './student-leaderboard-widget';

describe('StudentLeaderboardWidget', () => {
  let component: StudentLeaderboardWidget;
  let fixture: ComponentFixture<StudentLeaderboardWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentLeaderboardWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentLeaderboardWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
