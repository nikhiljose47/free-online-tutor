import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chapter, ClassSyllabus, DifficultyLevel, Subject } from '../../models/syllabus/class-syllabus.model';
import { SyllabusRepository } from '../../domain/repositories/syllabus.repository';
import { ContentPlaceholder } from '../content-placeholder/content-placeholder';
import { DotLoader } from '../dot-loader/dot-loader';

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [CommonModule, ContentPlaceholder, DotLoader],
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Timetable implements OnInit {

  @Input({ required: true }) classFileId!: string;

  private syllRepo = inject(SyllabusRepository);

  isLoading = signal(true);
  hasErr = signal(false);
  errMsg = signal('We are facing some issue..');

  readonly syllabus = signal<ClassSyllabus | null>(null);

  readonly selectedSubject = signal<string | null>(null);

  readonly current = signal<Record<string,string>>({});
  readonly progressIndex = signal<Record<string,number>>({});

  readonly subjects = computed<Subject[]>(() => {
    const data = this.syllabus();
    if(!data) return [];
    return data.subjects ?? [];
  });

  ngOnInit(): void {

    this.syllRepo.loadClass(this.classFileId).subscribe(data => {

      if(!data){
        this.isLoading.set(false);
        this.hasErr.set(true);
        return;
      }

      const normalized = this.normalizeSyllabus(data);

      this.syllabus.set(normalized);

      if(normalized.subjects.length){
        this.selectedSubject.set(normalized.subjects[0].code);
      }

      this.initRandomProgress(normalized);

      this.isLoading.set(false);
    });

  }

  private normalizeSyllabus(data:any):ClassSyllabus{
    return{
      ...data,
      subjects: Object.values(data.subjects ?? {}).map((s:any)=>({
        ...s,
        chapters: Object.values(s.chapters ?? {})
      }))
    };
  }

  private initRandomProgress(data:ClassSyllabus){

    const cur:Record<string,string> = {};
    const prog:Record<string,number> = {};

    data.subjects.forEach(subject=>{

      const total = subject.chapters.length;
      if(!total) return;

      const idx = Math.floor(Math.random()*total);

      prog[subject.code] = idx;
      cur[subject.code] = subject.chapters[idx].code;

    });

    this.progressIndex.set(prog);
    this.current.set(cur);

  }

  getChapterName(subjectCode:string,chapterCode:string):string{

    const data = this.syllabus();
    if(!data) return '';

    const subject = data.subjects.find(s=>s.code===subjectCode);

    return subject?.chapters.find(c=>c.code===chapterCode)?.name ?? '';

  }

  isCompleted(subjectCode:string,idx:number):boolean{
    return idx < (this.progressIndex()[subjectCode] ?? -1);
  }

  isCurrent(subjectCode:string,chapterCode:string):boolean{
    return this.current()[subjectCode] === chapterCode;
  }

  isLocked(subjectCode:string,idx:number):boolean{
    return idx > (this.progressIndex()[subjectCode] ?? -1);
  }

  getCurrent(subjectCode:string):string | null{
    return this.current()[subjectCode] ?? null;
  }

getMaxDifficulty(ch: Chapter): string {
  if (!ch?.divisions?.length) return '';

  const levels = ch.divisions.map(d => d.difficulty_level);

  if (levels.includes(DifficultyLevel.Medium)) return 'medium';
  return 'easy';
}
}