import { HttpRequest } from '@angular/common/http';

export interface HttpCacheRule {
  ttl: number;          // ms
  store: 'syllabus_by_class' | 'syllabus_index' | 'session_timelines';
}

const CACHE_RULES: Record<string, HttpCacheRule> = {
  'syllabus/': {
    ttl: 1000 * 60 * 60 * 24, // 24h
    store: 'syllabus_by_class',
  },
  'seo/meta': {
    ttl: 1000 * 60 * 60 * 24 * 7, // 7 days
    store: 'syllabus_index',
  },
  'seo/schema': {
    ttl: 1000 * 60 * 60 * 24 * 7,
    store: 'session_timelines',
  },
};

/** normalize cache key */
export const buildCacheKey = (req: HttpRequest<any>): string =>
  `${req.method}:${req.urlWithParams}`;

/** decide if request is cacheable */
export const getCacheRule = (
  req: HttpRequest<any>
): HttpCacheRule | null => {
  if (req.method !== 'GET') return null;
  if (req.headers.has('x-skip-cache')) return null;

  const entry = Object.entries(CACHE_RULES)
    .find(([path]) => req.url.includes(path));

  return entry?.[1] ?? null;
};
