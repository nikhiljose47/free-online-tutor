import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreCoursesBanner } from './explore-courses-banner';

describe('ExploreCoursesBanner', () => {
  let component: ExploreCoursesBanner;
  let fixture: ComponentFixture<ExploreCoursesBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreCoursesBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreCoursesBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
