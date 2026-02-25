export const APP_VERSION = '1.0.0';

export const SYLLABUS_VERSION = '1.0.0';

export const BUILD_INFO = {
  syllabus: SYLLABUS_VERSION,
  app: APP_VERSION,
  updatedOn: '2025-02-01',
};

export const SYLL_DATA_BASE_URL = 'https://authentication-785fd.web.app/data/';

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
  ANNOUNCEMENTS: 1 * 60 * 60 * 1000,
  ASSIGNMENTS: 5 * 60 * 1000, // 5 min
} as const;

export const DEF_BATCH = 'blue';

//IndexDb
export const INDEXED_DB_NAME = 'in.sunbay.academy.offline-data-db-v1.72026.app';

//Assets
export const PLACEHOLDER__COVER_IMG = 'assets/placeholder-cover.webp';
