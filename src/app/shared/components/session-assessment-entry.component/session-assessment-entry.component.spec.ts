import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionAssessmentEntryComponent } from './session-assessment-entry.component';

describe('SessionAssessmentEntryComponent', () => {
  let component: SessionAssessmentEntryComponent;
  let fixture: ComponentFixture<SessionAssessmentEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionAssessmentEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionAssessmentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
