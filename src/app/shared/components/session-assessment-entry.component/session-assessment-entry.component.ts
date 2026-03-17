import { Component, signal, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SessionImportRow = {
  studentId: string;
  assignmentMarks: number;
  maxMarks: number;
  engagementScore: number;
  remarks: string;
};

type ImportError = {
  row: number;
  message: string;
};

@Component({
  selector: 'session-assessment-entry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-assessment-entry.component.html',
  styleUrls: ['./session-assessment-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionAssessmentEntryComponent {
  @Output() closeEvent = new EventEmitter<void>();
  @Output() importEvent = new EventEmitter<SessionImportRow[]>();

  rawText = signal('');
  records = signal<SessionImportRow[]>([]);
  errors = signal<ImportError[]>([]);

  handlePaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text') || '';
    this.rawText.set(text);
  }
  import() {
    const text = this.rawText().trim();

    if (!text) {
      this.errors.set([{ row: 0, message: 'No data pasted' }]);
      return;
    }

    const lines = text.split('\n').map((v) => v.trim());

    const parsed: SessionImportRow[] = [];
    const errs: ImportError[] = [];

    lines.slice(1).forEach((line, i) => {
      if (!line.replace(/\t/g, '').trim()) return;

      const rowIndex = i + 2;
      const cols = line.split('\t');

      const studentId = cols[0]?.trim();
      const marks = cols[1]?.trim();
      const maxMarks = cols[2]?.trim();
      const rating = cols[3]?.trim();
      const remarks = cols[4]?.trim() || '';

      if (!studentId) {
        errs.push({ row: rowIndex, message: 'Student id missing' });
        return;
      }

      if (cols.length < 3) {
        errs.push({ row: rowIndex, message: 'Incomplete row data' });
        return;
      }

      if (cols.length > 5) {
        errs.push({ row: rowIndex, message: 'Extra column detected' });
        return;
      }

      if (!marks || isNaN(Number(marks)) || !Number.isInteger(Number(marks))) {
        errs.push({ row: rowIndex, message: 'Assignment marks must be integer' });
        return;
      }

      if (!maxMarks || isNaN(Number(maxMarks)) || !Number.isInteger(Number(maxMarks))) {
        errs.push({ row: rowIndex, message: 'Max marks must be integer' });
        return;
      }

      if (Number(marks) > Number(maxMarks)) {
        errs.push({ row: rowIndex, message: 'Assignment marks cannot exceed max marks' });
        return;
      }

      if (rating && (isNaN(Number(rating)) || !Number.isInteger(Number(rating)))) {
        errs.push({ row: rowIndex, message: 'Participation rating must be integer' });
        return;
      }

      parsed.push({
        studentId,
        assignmentMarks: Number(marks),
        maxMarks: Number(maxMarks),
        engagementScore: Number(rating || 0),
        remarks,
      });
    });

    this.errors.set(errs);
    this.records.set(parsed);

    if (!errs.length) {
      this.importEvent.emit(parsed);
      this.closeEvent.emit();
    }
  }

  close() {
    this.closeEvent.emit();
  }
}
