import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowOrchestratorService } from '../../services/user-flow/flow-orchestrator/flow-orchestrator.service';

@Component({
  selector: 'flow-orchestrator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngComponentOutlet="vm.currentComponent(); inputs: vm.childInputs"></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowOrchestratorComponent {
  readonly vm = inject(FlowOrchestratorService);
}
