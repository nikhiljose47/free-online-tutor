import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http')) {
    return next(req);
  }

  let baseUrl = environment.syllabusApiBaseUrl;

  if (req.url.startsWith('syllabus/')) {
    baseUrl = environment.syllabusApiBaseUrl;
  }

  if (req.url.startsWith('attendance/')) {  
    baseUrl = environment.attendanceApiBaseUrl;
  }

  return next(
    req.clone({
      url: `${baseUrl}/${req.url}`,
    })
  );
};
