import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningSkeleton } from './learning-skeleton';

describe('LearningSkeleton', () => {
  let component: LearningSkeleton;
  let fixture: ComponentFixture<LearningSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
