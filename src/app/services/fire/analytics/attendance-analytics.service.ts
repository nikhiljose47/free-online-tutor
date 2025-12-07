import { Injectable } from '@angular/core';
import { Meeting } from '../meetings/meetings.service';

@Injectable({ providedIn: 'root' })
export class AttendanceAnalyticsService {
  /** ✔ Count total attendance */
  countAttendance(meeting: Meeting) {
    return meeting.attendence?.length ?? 0;
  }

  /** ✔ Check if student attended */
  hasAttended(meeting: Meeting, studentId: string) {
    return meeting.attendence?.includes(studentId) ?? false;
  }

  /** ✔ Get attendance percentage */
  attendancePercentage(meeting: Meeting, totalStudents: number) {
    const attended = meeting.attendence?.length ?? 0;
    return totalStudents > 0 ? Math.round((attended / totalStudents) * 100) : 0;
  }

  /** ✔ Most active students (top N) */
  topStudents(meetings: Meeting[], topN = 5) {
    const counts: Record<string, number> = {};

    for (const m of meetings) {
      for (const id of m.attendence ?? []) {
        counts[id] = (counts[id] || 0) + 1;
      }
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([id, count]) => ({ id, count }));
  }
}
