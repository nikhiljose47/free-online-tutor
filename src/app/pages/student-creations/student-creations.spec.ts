import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBoard } from './student-creations';

describe('StudentBoard', () => {
  let component: StudentBoard;
  let fixture: ComponentFixture<StudentBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
