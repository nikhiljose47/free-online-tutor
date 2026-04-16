export type SvgSlide =
  | IntroSlide
  | TextSlide
  | BulletSlide
  | ImageSlide
  | StatsSlide
  | StaticSlide
  | SplitSlide;

type BaseSlide = {
  id: string;
  type: SlideType;
  path: string;
  duration?: number;

  anim?: {
    enter?: 'fade' | 'slide' | 'scale' | 'none';
    delay?: number;
  };
};

export type StaticSlide = BaseSlide & {
  type: 'static';
};

export type SlideType =
  | 'intro'
  | 'text'
  | 'image'
  | 'stats'
  | 'bullet'
  | 'static'
  | 'split';

/* ---------------- TYPES ---------------- */

export type IntroSlide = BaseSlide & {
  type: 'intro';
  data: {
    title: string;
    date: string;
  };
};

export type BulletSlide = BaseSlide & {
  type: 'bullet';
  data: {
    title: string;
    points: string[];
  };
};

export type TextSlide = BaseSlide & {
  type: 'text';
  data: {
    heading: string;
    sub?: string;
    desc?: string;
  };
};

export type ImageSlide = BaseSlide & {
  type: 'image';
  data: {
    image: string;
    caption?: string;
  };
};

export type StatsSlide = BaseSlide & {
  type: 'stats';
  data: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  };
};

export type SplitSlide = BaseSlide & {
  type: 'split';
  data: {
    left: Record<string, string>;
    right: Record<string, string>;
  };
};
