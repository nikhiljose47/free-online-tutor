import { HttpInterceptorFn } from '@angular/common/http';
import { of, tap } from 'rxjs';
import { environment } from '../../environments/environment.prod';

const cache = new Map<string, any>();

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http')) {
    return next(req);
  }

  let baseUrl = environment.syllabusApiBaseUrl;

  if (req.url.startsWith('syllabus/')) {
    baseUrl = environment.syllabusApiBaseUrl;
  }

  if (req.url.startsWith('data/')) {
    baseUrl = environment.syllabusApiBaseUrl;
  }

  const apiReq = req.clone({
    url: `${baseUrl}/${req.url}`,
  });

  if (apiReq.method === 'GET' && cache.has(apiReq.url)) {
    return of(cache.get(apiReq.url));
  }

  return next(apiReq).pipe(
    tap((res) => {
      if (apiReq.method === 'GET') {
        cache.set(apiReq.url, res);
      }
    })
  );
};
