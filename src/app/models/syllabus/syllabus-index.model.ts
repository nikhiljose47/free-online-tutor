export interface SyllabusIndex {
  version: string;
  generatedAt: string;
  primaryGroup: string;
  groups: string[];
  catalog: CatalogItem[];
}
export type CatalogType = 'class' | 'exam' | 'activity' | 'course' | 'bundle';

export type PrimaryGroup =
  | 'school'
  | 'exam-prep'
  | 'coding'
  | 'creative'
  | 'language'
  | 'wellness'
  | 'career'
  | 'skills';

// export type CatalogGroup =
//   | 'school-class'
//   | 'kids'
//   | 'exam-jam'
//   | 'wellness'
//   | 'music'
//   | 'coding'
//   | 'aptitude';

export interface CatalogItem {
  id: string;
  type: CatalogType;
  primaryGroup: PrimaryGroup;
  groups: string[];
  title: string;
  enabled: boolean;
  ready: boolean;
  priority: number;
  file: string;
  availableFrom?: string;
  startsAt?: string;
  isLive?: boolean;
  meta: CatalogMeta;
}

export interface CatalogMeta {
  students?: number;
  teachers?: number;
  medium?: string[];
  teacher?: string;
  language?: string[];
  image: string;
}
