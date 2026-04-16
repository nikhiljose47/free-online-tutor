import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiLearnResultCardComponent } from './ai-learn-result-card.component';

describe('AiLearnResultCardComponent', () => {
  let component: AiLearnResultCardComponent;
  let fixture: ComponentFixture<AiLearnResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLearnResultCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiLearnResultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
