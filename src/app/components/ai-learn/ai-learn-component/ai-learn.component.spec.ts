import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiLearnComponent } from '../ai-learn.component';

describe('AiLearnComponent', () => {
  let component: AiLearnComponent;
  let fixture: ComponentFixture<AiLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLearnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
