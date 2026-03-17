import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSessionResultsListComponent } from './student-session-results-list.component';

describe('StudentSessionResultsListComponent', () => {
  let component: StudentSessionResultsListComponent;
  let fixture: ComponentFixture<StudentSessionResultsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSessionResultsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSessionResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
