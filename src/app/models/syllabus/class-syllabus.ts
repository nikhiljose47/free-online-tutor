export interface  ClassSyllabus {
  classId: string;
  className: string;
  code_prefix: string;
  syllabus_year: string;
  source: string;
  meta: string;
  subjects: Subject[];
}

export interface Subject {
  name: string;
  code: string;
  chapters: Chapter[];
}

export interface Chapter {
  code: string;
  name: string;
  agenda: string[];
  session_instructions: SessionInstruction[];
  teacher_aids: string[];
  content_structure: ContentStructure;
  learning_mode_mix: LearningModeMix;
  image_assets: ImageAsset[];
  division_count: number;
  divisions: Division[];
}

export interface ContentStructure {
  theory_ratio: number;
  worked_examples_ratio: number;
  practice_ratio: number;
  application_ratio: number;
}

export interface Division {
  code: string;
  name: string;
  conceptual_understanding: string[];
  student_can_achieve: string[];
  difficulty_level: DifficultyLevel;
  time_estimate_min: number;
  meta: DivisionMeta;
}

export enum DifficultyLevel {
  Easy = 'easy',
  Medium = 'medium',
}

export interface DivisionMeta {
  nature: string;
  exam_weight: ExamWeight;
}

export enum ExamWeight {
  High = 'high',
  Low = 'low',
  Medium = 'medium',
}

export interface ImageAsset {
  id: string;
  name: string;
  src: string;
  relevant: string;
}

export interface LearningModeMix {
  theoretical: number;
  practical: number;
  discussion: number;
}

export interface SessionInstruction {
  type: Type;
  text: string;
}

export enum Type {
  Activity = 'activity',
  Instruction = 'instruction',
}
