import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowOrchestratorComponent } from './flow-orchestrator.component';

describe('FlowOrchestratorComponent', () => {
  let component: FlowOrchestratorComponent;
  let fixture: ComponentFixture<FlowOrchestratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowOrchestratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowOrchestratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
