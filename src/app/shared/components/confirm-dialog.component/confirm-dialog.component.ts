import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../../services/common/confirm.service';

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {

  private confirmService = inject(ConfirmService);

  vm = this.confirmService.state;

  onConfirm() {
    this.confirmService.confirm();
  }

  onCancel() {
    this.confirmService.cancel();
  }
}