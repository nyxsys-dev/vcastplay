import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Unauthorized! Redirecting to login...');
        // Example: redirect to login page
        window.location.href = '/login';
      } else if (error.status === 403) {
        console.error('Forbidden! You do not have permission.');
        alert('Access denied!');
      } else if (error.status === 0) {
        console.error('Network error! Please check your connection.');
      } else {
        console.error('API Error:', error.message);
      }

      return throwError(() => error);
    })
  );
};
