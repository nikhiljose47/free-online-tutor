export interface ClassSyllabus {
  class: string;
  code_prefix: string;
  desc: string;
  subjects: Record<string, Subject>;
  meta: string;
}

export interface Subject {
  code: string;
  chapters: Chapter[];
}

export interface Chapter {
  code: string;
  name: string;
  desc?: string;
}

/* ============================
   CORE MODELS
============================ */

export interface ClassSyllabus2 {
  class: string;              // e.g. "Class 8"
  code_prefix: string;        // e.g. "SYLL-CL08"
  desc: string;               // syllabus description
  meta?: string;              // learning philosophy / goal
  subjects: Record<string, SubjectSyllabus2>;
}

/* ============================
   SUBJECT
============================ */

export interface SubjectSyllabus2 {
  code: string;               // e.g. CL08-MATH
  desc?: string;
  meta?: string;
  chapters: ChapterSyllabus2[];
}

/* ============================
   CHAPTER
============================ */

export interface ChapterSyllabus2 {
  code: string;               // e.g. CL08-MATH-01
  name: string;
  desc: string;               // chapter overview
  meta?: string;              // teaching intent / skill focus
  divisions: ChapterDivision2[];
}

/* ============================
   CHAPTER DIVISION / SUB-TOPIC
============================ */

export interface ChapterDivision2 {
  code: string;               // e.g. CL08-MATH-01-A
  name: string;
  desc: string;               // specific topic explanation
  meta?: string;              // depth, application, exam focus
}
