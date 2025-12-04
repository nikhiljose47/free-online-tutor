import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassStreamSidebar } from './class-stream-sidebar';

describe('ClassStreamSidebar', () => {
  let component: ClassStreamSidebar;
  let fixture: ComponentFixture<ClassStreamSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassStreamSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassStreamSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
