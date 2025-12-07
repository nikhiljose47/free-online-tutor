export interface Chapter {
  code: string;
  name: string;
}

export interface Subject {
  code: string;
  chapters: Chapter[];
}

export interface ClassSyllabus {
  class: string;
  code_prefix: string;
  desc: string,
  subjects: Record<string, Subject>;
  meta: string
}
