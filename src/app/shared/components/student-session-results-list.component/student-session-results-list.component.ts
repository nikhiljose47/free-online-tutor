import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSessionResult } from '../../../models/assessment/student-session-result.model';

@Component({
  selector: 'student-session-results-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-session-results-list.component.html',
  styleUrls: ['./student-session-results-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentSessionResultsListComponent {
  @Output() refetch = new EventEmitter<void>();
  @Input({ required: true }) data: StudentSessionResult[] = [];

  trackStudent = (_: number, r: StudentSessionResult) => r.studentId ?? r.studentUid;
  get avgMarks(): number {
    if (!this.data?.length) return 0;
    return this.data.reduce((s, r) => s + r.assignmentMarks, 0) / this.data.length;
  }

  get avgEngagement(): number {
    if (!this.data?.length) return 0;
    return this.data.reduce((s, r) => s + r.engagementScore, 0) / this.data.length;
  }
}