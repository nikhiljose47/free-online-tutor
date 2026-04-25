export const APP_VERSION = '1.0.0';

export const SYLLABUS_VERSION = '1.0.0';

export const BUILD_INFO = {
  syllabus: SYLLABUS_VERSION,
  app: APP_VERSION,
  updatedOn: '2025-02-01',
};

export const TEACHER_JOB_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfdc532mfApDy0MyTY_eJhI-awJViiBlqPsk_QS2-XUxVcH0A/viewform';
export const SYLL_DATA_BASE_URL = 'https://authentication-785fd.web.app/index/';

export const SYLL_INDEX_CACHE_KEY = 'syllabus_index_ckey';

export const UPCOMING = 'upcoming';
export const COMPLETED = 'completed';
export const LIVE = 'live';

export const ADMIN = 'admin';
export const USER = 'user';
export const TEACHER = 'teacher';

export const PART1 = 'part1';
export const PART2 = 'part2';
export const PART3 = 'part3';
export const PART4 = 'part4';

//Collection ID
export const GLOBAL_MEETINGS = 'global_meetings';
export const USERS = 'users';

export type SyllabusErrorCode =
  | 'DATA_NOT_PUBLISHED'
  | 'UNDER_REVIEW'
  | 'MAINTENANCE'
  | 'NETWORK_ERROR'
  | 'INVALID_SCHEMA';

export const CACHE_TTL = {
  TEACHERS_LIST: 5 * 24 * 60 * 60 * 1000, // 5 days
  TEACHER_BY_ID: 2 * 60 * 60 * 1000, // 2 hour
  BATCH_DOC: 5 * 60 * 1000, // 5 min
  ANNOUNCEMENTS: 6 * 60 * 60 * 1000, // 6 hours
  ASSIGNMENTS: 5 * 60 * 1000, // 5 min
  PUZZLE_SESS: 24 * 60 * 60 * 1000, //24 hr
  ASSESSMENT: 2 * 60 * 60 * 1000, //2 hr
} as const;


//Age-Class relation
export const CLASS_AGE_RANGE: Record<string, [number, number]> = {
  'Class 1': [5, 6],
  'Class 2': [6, 7],
  'Class 3': [7, 8],
  'Class 4': [8, 9],
  'Class 5': [9, 10],
  'Class 6': [10, 11],
  'Class 7': [11, 12],
  'Class 8': [12, 13],
  'Class 9': [13, 14],
  'Class 10': [14, 15],
};

export const DEF_SLIDE_BG_DURATION = 4000;
export const DEF_BATCH = 'blue';

//IndexDb
export const INDEXED_DB_NAME = 'in.sunbay.academy.offline-data-db-v1.72026.app';


//Variables
export const CUR_CLASS_INFO = 'cur_class_info';

//Assets
export const AUDIO_BG_PATH = 'assets/audio/bg-presentation.mp3';

export const TYPE_CONFIG: Record<string, { path: string; duration: number }> = {
  intro: { path: 'assets/slides/intro.svg', duration: 4000 },
  text: { path: 'assets/slides/text.svg', duration: 6000 },
  stats: { path: 'assets/slides/stats.svg', duration: 6000 },
  split: { path: 'assets/slides/split.svg', duration: 6500 },
  bullet: { path: 'assets/slides/bullet-points.svg', duration: 10000 },
  image: { path: 'assets/slides/image.svg', duration: 10000 },
  static: { path: 'assets/slides/conclude.svg', duration: 6000 },
  outro: { path: 'assets/slides/conclude.svg', duration: 5000 },
};


export const PLACEHOLDER__COVER_IMG = 'assets/placeholder.svg';
export const DEF_AVATAR_ID = 'avatar-boy-01';
export const AVATARS = [
  'avatar-boy-01',
  'avatar-boy-02',
  'avatar-boy-03',
  'avatar-boy-04',
  'avatar-girl-01',
  'avatar-girl-02',
  'avatar-girl-03',
  'avatar-girl-04',
];



//DUmmy
export const CHANNELS_RAW = [
  {
    id: 101,
    name: 'Angular Signals',
    tag: 'Frontend',
    slides: [
      {
        type: 'intro',
        data: { title: 'Angular Signals', date: 'Reactive Future' },
      },
      {
        type: 'text',
        data: { heading: 'Why Signals?', desc: 'Fine-grained reactivity...' },
      },
      {
        type: 'split',
        data: {
          left: { name: 'signal()', role: 'State' },
          right: { name: 'computed()', role: 'Derived' },
        },
      },
      {
        type: 'bullet',
        data: {
          title: 'Adoption Path',
          points: ['Start local', 'Replace RxJS'],
        },
      },
      {
        type: 'image',
        data: { image: 'https://picsum.photos/400/300', caption: 'UI' },
      },

      { type: 'text', data: { heading: 'Summary', desc: 'Signals = Fast UI' } },
      { type: 'static' },
    ],
  },
];
