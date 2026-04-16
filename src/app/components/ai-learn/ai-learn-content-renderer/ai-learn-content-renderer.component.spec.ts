import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiLearnContentRendererComponent } from './ai-learn-content-renderer.component';

describe('AiLearnContentRendererComponent', () => {
  let component: AiLearnContentRendererComponent;
  let fixture: ComponentFixture<AiLearnContentRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLearnContentRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiLearnContentRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
