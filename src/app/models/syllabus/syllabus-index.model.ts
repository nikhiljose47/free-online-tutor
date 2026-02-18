export interface SyllabusIndex {
  version: string;
  generatedAt: string;
  groups: CatalogGroup[];
  catalog: CatalogItem[];
}

export type CatalogGroup =
  | 'school-class'
  | 'exam-jam'
  | 'wellness'
  | 'music'
  | 'coding'
  | 'aptitude';


export interface CatalogItem {
  id: string;
  /** class | exam | activity | future: course | bundle */
  type: CatalogType;
  group: CatalogGroup;
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


export type CatalogType = 'class' | 'exam' | 'activity' | 'course' | 'bundle';


export interface CatalogMeta {
  students?: number;
  teachers?: number;
  medium?: string[];
  teacher?: string;
  language?: string[];
  image: string;
}
