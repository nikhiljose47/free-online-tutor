export interface SyllabusIndex {
  version: string;
  generatedAt: string;

  classes: {
    id: string;
    label: string;
    enabled: boolean;
    ready: boolean;
    priority: number;
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
    isLive: boolean;
    startsAt: string;
    priority: number;
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
    startsAt: string;
    priority: number;
    fileName: string;

    meta: {
      teacher: string;
      image: string;
    };
  }[];
}