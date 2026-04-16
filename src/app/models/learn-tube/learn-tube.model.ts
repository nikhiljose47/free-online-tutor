export interface LearnTubeModel {
  id: string;
  primaryGroup: string;
  groups: string[];
  title: string;
  enabled: boolean;
  ready: boolean;
  startsAt: string;
  priority: number;
  meta: LearnTubeMeta;
  slideSets: LearnTubeSlideSet[];
}


export interface LearnTubeSlideSet {
  setId: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  order: number;
  bg?: string;
  slides: LearnTubeSlide[];
  quiz?: LearnTubeQuiz;
}

export interface LearnTubeSlide {
  type: 'intro' | 'text' | 'split' | 'bullet' | 'image';
  data?: any;
}

export interface LearnTubeQuiz {
  type: 'mcq' | 'mixed';
  questions: LearnTubeQuestion[];
}

export interface LearnTubeQuestion {
  id: string;
  type?: 'mcq' | 'puzzle';
  question: string;
  options?: string[];
  correctIndex?: number;
  items?: string[];
  correctOrder?: number[];
}


export interface LearnTubeMeta {
  teacher: string;
  image: string;
}
