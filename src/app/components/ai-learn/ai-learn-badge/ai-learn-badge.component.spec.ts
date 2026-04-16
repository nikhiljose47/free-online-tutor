import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiLearnBadgeComponent } from './ai-learn-badge.component';

describe('AiLearnBadgeComponent', () => {
  let component: AiLearnBadgeComponent;
  let fixture: ComponentFixture<AiLearnBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLearnBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiLearnBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
