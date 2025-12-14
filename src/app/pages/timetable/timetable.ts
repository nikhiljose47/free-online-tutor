import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ClassSyllabus } from '../../core/constants/syllabus/syllabus.model';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../services/store/data-store';
import { CLASS6_SYLLABUS } from '../../core/constants/syllabus/cl6-syllabus';
import { MeetingsService } from '../../domain/meetings/meetings.service';

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English',
  HIN: 'Hindi',
  MATH: 'Mathematics',
  SCI: 'Science',
  EVS: 'EVS',
};

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timetable implements OnInit {
  @Input({ required: true }) type!: string;
  @Input({ required: true }) classId!: string;

  isInvalid = true;
  syllabus: ClassSyllabus = CLASS6_SYLLABUS;

  private meetApi = inject(MeetingsService);
  private docCache = inject(DataStoreService);

  mathUpcoming = signal<any>([]);
  mathCurrentChapter = signal<any>([]);

  current = signal<Record<string, string>>({});

  ngOnInit(): void {
    this.meetApi.getMeetingsForClass(this.classId);
    this.docCache.getDoc('classes', 'CL06').subscribe((res) => {
      if (res.ok) {
        console.log('data');
        console.log(res.data);
        this.loadCurrentChaptersFromDb(res.data);
      }
    });
  }

  notes = signal<Record<string, string>>({
    'CL5-MATH-04': 'Important chapter',
    'CL5-ENG-03': 'Fun and easy to learn',
    'CL5-HIN-07': 'Pivot chapter for exams',
    'CL5-EVS-05': 'Good to attend this',
  });

  live = signal<Record<string, any[]>>({
    English: [{ time: '2:00 PM', batch: 'A', status: 'Upcoming' }],
    Hindi: [],
    EVS: [],
  });

  // -------------------------------------------------------------------
  // 🔥 REPLACEMENT: Get upcoming meetings for Class 5 — MATH only
  // -------------------------------------------------------------------
 

  //TODO

  // mathUpcoming = computed(() => {
  //   const groups = this.meetApi.groupedFor('CL5')(); // { live, upcoming, completed }
  //   return groups.upcoming.filter((m) => m.subjectId === 'Mathematics');
  // });

  // // 🔥 REPLACEMENT: Auto-detect current mathematics chapter from latest completed meeting
  // mathCurrentChapter = computed(() => {
  //   const completed = this.meetApi.groupedFor('CL5')().completed;

  //   // find latest completed meeting of Maths
  //   const math = completed
  //     .filter((m) => m.subjectId === 'Mathematics')
  //     .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());

  //   return math[0]?.chapterCode ?? this.current()['Mathematics'];
  // });

  // Utility: Get chapter name from syllabus
  getChapterName(subjectKey: string, chapterCode: string): string {
    const subject = this.syllabus.subjects[subjectKey];
    return subject?.chapters?.find((ch) => ch.code === chapterCode)?.name ?? '';
  }

  loadCurrentChaptersFromDb(data: any) {
    const result: Record<string, string> = {};

    Object.entries(data).forEach(([code, obj]: any) => {
      // Extract subject part -> CL06-MATH → MATH
      const subjectCode = code.split('-')[1];

      // Convert to readable subject name
      const subjectName = SUBJECT_MAP[subjectCode] ?? subjectCode;

      // If no current chapter, default to CLASS-SUB-01
      const finalIndex = obj.curIndex && obj.curIndex.trim() !== '' ? obj.curIndex : `${code}-01`;

      result[subjectName] = finalIndex;
    });

    // Update signal
    this.current.set(result);
  }
}
