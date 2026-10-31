import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  private readonly unhandledStatusCodes: number[] = [400, 401, 403, 404];

  constructor() {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.filterError(error);
        const errorResponse = error.error;
        errorResponse.status = error.status;
        throw errorResponse;
      }),
    );
  }

  filterError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
      case 403:
        //desloguear session caducada
        break;
      default:
        break;
    }
    if (this.unhandledStatusCodes.indexOf(error.status) !== -1) {
      const errorResponse = error.error;
      errorResponse.status = error.status;
      throw errorResponse;
    }
  }
}
