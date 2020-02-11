import { Injectable } from '@angular/core';
import {
  Route,
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  UrlSegment
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    if (this.authenticationService.isLoggedIn) {
      const isPermit = this.authenticationService.hasAccess(route);
      if (!isPermit) {
        this.router.navigate(['unauthorized']).then(() => null);
      }
      return isPermit;
    }

    return this.redirectLogin(state.url);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authenticationService.isLoggedIn) {
      const isPermit = this.authenticationService.hasAccess(route);
      if (!isPermit) {
        this.router.navigate(['unauthorized']).then(() => null);
      }
      return isPermit;
    }
    const fullPath = segments.reduce((path, currentSegment) => {
      return `${path}/${currentSegment.path}`;
    }, '');

    return this.redirectLogin(fullPath);
  }

  public redirectLogin(url: string): boolean {
    this.authenticationService.redirectUrl = url;
    this.router.navigate(['/login']).then(() => null);
    return false;
  }
}
