import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersNote } from './teachers-note';

describe('TeachersNote', () => {
  let component: TeachersNote;
  let fixture: ComponentFixture<TeachersNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachersNote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachersNote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
