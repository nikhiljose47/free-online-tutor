import { TestBed } from '@angular/core/testing';

import { FlowOrchestratorService } from './flow-orchestrator.service';

describe('FlowOrchestratorService', () => {
  let service: FlowOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
