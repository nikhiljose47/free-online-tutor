export interface SyllabusIndex {
  version: string;
  generatedAt: string;

  classes: {
    id: string;
    label: string;
    enabled: boolean;
    ready: boolean;
    priority: number;
    group: string;
    availableFrom: string;
    fileName: string;
    meta: {
      students: number;
      teachers: number;
      medium: string[];
      image: string;
    };
  }[];

  jamSessions: {
    id: string;
    title: string;
    enabled: boolean;
    ready: boolean;
    startsAt: string;
    priority: number;
    group: string;
    fileName: string;
    meta: {
      teacher: string;
      language: string[];
      image: string;
    };
  }[];

  activities: {
    id: string;
    title: string;
    enabled: boolean;
    ready: boolean;
    startsAt: string;
    priority: number;
    group: string;
    fileName: string;
    meta: {
      teacher: string;
      language: string[];
      image: string;
    };
  }[];
}
