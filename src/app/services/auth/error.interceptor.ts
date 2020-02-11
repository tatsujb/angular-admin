import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

/**
 * ErrorInterceptor that catch unauthorized request and try to refresh
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if ( err instanceof HttpErrorResponse && 401 === err.status) {
            return this.handle401Error(request, next);
        } else {
          return throwError(err);
        }

      })
    );
  }

  /**
   * handle 401 http error on requests
   */
  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap(_ => {
          this.tokenSubject.next(this.authService.getRawToken());
          return next.handle(this.addAuthenticationToken(req));
        }),
        catchError(error => {
          this.router.navigate(['/logout']).then(() => null);
          return of(error);
        }),
        finalize(() => this.isRefreshingToken = false)
      );
    } else {
      return this.tokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addAuthenticationToken(req)))
      );
    }
  }

  /**
   *  Add token to request header
   */
  addAuthenticationToken(request: any) {
    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: this.authService.getRequestOptions()
      }
    });
  }
}
