import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseViewPage } from './course-view-page';

describe('CourseViewPage', () => {
  let component: CourseViewPage;
  let fixture: ComponentFixture<CourseViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
