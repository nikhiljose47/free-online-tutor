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
