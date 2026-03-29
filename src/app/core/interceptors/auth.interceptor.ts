import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.get('skip-interceptor')) {
    return next(req);
  }
  const token = 'recuperarloDedondeSea';
  const reqWithAuthHeader = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;
  return next(reqWithAuthHeader);
};
