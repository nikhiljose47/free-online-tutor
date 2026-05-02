import { Chapter, Division } from "../syllabus/class-syllabus.model";


export interface CurrentClassState {
  classId: string;
  className: string;
  chapter?: Chapter | null;
  divisions?: Division[] | null;
  nextChapter?: Chapter | null;
  batchId?: string;
}