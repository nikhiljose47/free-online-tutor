import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassWrapup } from './class-wrapup';

describe('ClassWrapup', () => {
  let component: ClassWrapup;
  let fixture: ComponentFixture<ClassWrapup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassWrapup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassWrapup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
