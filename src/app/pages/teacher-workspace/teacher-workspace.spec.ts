import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherWorkspace } from './teacher-workspace';

describe('TeacherWorkspace', () => {
  let component: TeacherWorkspace;
  let fixture: ComponentFixture<TeacherWorkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherWorkspace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherWorkspace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
