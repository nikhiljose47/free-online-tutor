import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassDetailsPage } from './class-details-page';

describe('ClassDetailsPage', () => {
  let component: ClassDetailsPage;
  let fixture: ComponentFixture<ClassDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
