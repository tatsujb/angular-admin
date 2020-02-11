import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import '../entities/models';
import { API_URL, AUTH_URL, HOMEPAGE_URL } from '../../environments/environment';
import { JwtToken, User } from '../entities/models';

@Injectable()
export class AuthenticationService {
  public token: JwtToken;
  public refUser: any;
  public redirectUrl: string;
  public homePageUrl: string | null = null;
  public currentUser: User;
  public isIE: boolean | null = null;
  private jwtHelper: JwtHelperService;
  private showConnectBtn = false;
  private countDownToken: number;
  private countDownTokenTimeout: any;
  private timeLeft: any;
  private tick = 1000; // delay ms
  private checkTokenActive: boolean;
  private refreshInProgress = false;
  private inactivity = false;
  private timerHandle: any = null;
  private inProgressOneLogin = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private permissionService: NgxPermissionsService
  ) {
    //#region auth
    this.jwtHelper = new JwtHelperService();

    // define/overload homepage url
    this.homePageUrl = `${HOMEPAGE_URL}`;
    // set token if saved in local storage
    if (sessionStorage.getItem('id_token')) {
      const rawToken: string | null = sessionStorage.getItem('id_token');
      this.decryptToken(rawToken);
    } else {
      let temp: Array<string> | string = window.location.href.split('/');
      temp = temp[temp.length].split('#');
      if (temp[0] === undefined || temp[0] === null || temp[0] !== 'login') {
        this.showConnectBtn = true;
        this.router.navigate(['/login']).then(() => null);
      } else if (temp[0] === 'login' && temp[1]) {
        temp = temp[1].split('=')[0];
        if (temp !== 'id_token') {
          this.showConnectBtn = true;
          this.router.navigate(['/logout']).then(() => null);
        }
      }
    }
    //#endregion auth
  }

  // Retourne l'url de OneLogin et le parametre classicAuth (à 0: OneLogin)
  private static getClassicAuthURL() {
    const referer = window.location.href.indexOf('localhost') > -1 ? 'http://127.0.0.1:4200/login' : window.location.href ;
    return (AUTH_URL + referer);
  }

  private sleep(milliseconds: number) {
    const start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
      const end = new Date().getTime();
      if (end - start > milliseconds) {
        break;
      }
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  private getToken(): JwtToken {
    return this.token;
  }

  private clearCountDownTokenTimeout(): void {
    clearTimeout(this.countDownTokenTimeout);
  }

  private tokenIsExpired(): boolean | null {
    if (this.token && this.token.isExpired !== undefined) {
      return this.token.isExpired;
    }
    return null;
  }

  private startChecking() {
    // console.info('startChecking');
    this.resetTimer();
    // Bind the methods to the proper context
    window.onload = this.resetTimer.bind(this);
    document.onmousemove = this.resetTimer.bind(this);
    document.onkeypress = this.resetTimer.bind(this);
  }

  private stopChecking() {
    // console.info('stopChecking');
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
      this.inactivity = false;
    }
  }

  private resetTimer() {
    // console.info('resetTimer');
    this.stopChecking();
    this.timerHandle = setTimeout((): void => {
      this.inactivity = true;
    }, 1000 * 60 * 10); // 10 min for token 30min
    // this.timerHandle = setTimeout((): void => { this.inactivity = true; console.info('inactive'); }, 1000); // 1 sec for test
  }

  /**
   * Calls the token API after OneLogin authentication
   */
  private getApiToken(
    hrefUrl: any[],
    resolve: { (value?: boolean | PromiseLike<boolean> | undefined): void; (arg0: boolean): void; },
    reject: (arg0: string) => void
  ) {
    if (this.inProgressOneLogin) { return; }
    this.inProgressOneLogin = true;
    const referer = hrefUrl[0];
    const parmidToken = hrefUrl[1];
    const url = AUTH_URL + referer + '&' + parmidToken;
    this.http
      .get(url)
      .subscribe((data: any) => {
        this.inProgressOneLogin = false;
        if (data.status === 1 && data.api_token && data.api_token.length > 30) {
          this.token = data.api_token;
          sessionStorage.setItem('token', this.token.raw);
          console.log('token might be preferable to "token.raw" in the passed parameter here');
          console.log('token : ', this.token);
          console.log('token.raw : ', this.token.raw);
          resolve(this.decryptToken(this.token.raw));
        } else {
          reject('Unexpected error: ' + data.message);
        }
      });
  }

  /**
   * refresh with windows authentication
   */
  refreshToken(): Observable<any> {
    this.refreshInProgress = true;
    this.clearCountDownTokenTimeout();
    return this.http
      .get(
        `${API_URL}provisioning/api/auth/refresh/tokens`,
        this.getRequestOptions()
      );
  }

  /**
   * remove token
   */
  private removeToken(): Observable<any> | boolean {
    if (this.currentUser) {
      this.clearCountDownTokenTimeout();
      return this.http
        .delete(
          `${API_URL}provisioning/api/auth/tokens/${this.currentUser.id}`,
          this.getRequestOptions()
        );
    }
    return false;
  }

  private hasRights(roles: Array<string>) {
    if (roles) {
      let hasAccess: boolean;
      const currentUser: any = this.getCurrentUser();
      if (roles.length) {
        roles.forEach((role: any) => {
          if (currentUser && currentUser.roles.find((r: any) =>  r === role)) {
            hasAccess = true;
          }
        });
      }
      // @ts-ignore
      if (hasAccess) {
        return true;
      }
    }
    return false;
  }

  private countDownTokenAction(): void {
    if (this.countDownToken && this.countDownToken > 5000) {
      this.countDownTokenTimeout = setTimeout((): void => {
        this.countDownToken = this.countDownToken - this.tick;
        this.countDownTokenAction();
      }, this.tick);
    } else if (this.countDownToken !== undefined) {
      if (this.countDownTokenTimeout) {
        clearTimeout(this.countDownTokenTimeout);
      }
      const obs = this.removeToken();
      if (typeof obs !== 'boolean') {
        obs.subscribe(result => {
          this.checkTokenActive = false;
          return true;
        });
      }
    }
  }

  private getTokenTimeLeft() {
    this.checkTokenActive = false;
    // false is specified for avoid undefined and null value
    if (this.tokenIsExpired() === false) {
      const exp: number = Date.parse(this.getToken().expirationDate);
      const now: number = Date.now();
      this.timeLeft = exp - now;
      this.countDownToken = this.timeLeft;
      this.checkTokenActive = this.timeLeft > 0;
    }
  }

  /**
   * detect IE
   * returns version of IE or false, if browser is not Internet Explorer
   */
  private detectIE() {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    // other browser
    return false;
  }

  /**
   * creates the generic header for POST api calls and other canns that require a token
   */
  public getRequestOptions() {
    return {headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token.raw})};
  }

  public tokenExpiredDialog(): void {
    // Manually redirect
    // const myDialog = custom({
    //   title: 'You are disconnected',
    //   messageHtml: `Please, reconnect to use the administration tools.`,
    //   buttons: [
    //     {
    //       text: 'Reconnect',
    //       icon: 'revert',
    //       type: 'default',
    //       onClick: (): void => {
    //         clearTimeout(countDownLogout);
    //         this.router.navigate(['/login']).then(r => null).then(() => null);
    //       }
    //     },
    //     {
    //       text: 'Quit',
    //       icon: 'revert',
    //       type: 'danger',
    //       onClick: (): void => {
    //         clearTimeout(countDownLogout);
    //         this.router.navigate(['/logout']).then(r => null).then(() => null);
    //       }
    //     }
    //   ]
    // });
    // myDialog.show();
    // Redirect auto after 20sec
    const countDownLogout = setTimeout((): void => {
      // myDialog.hide();
      this.router.navigate(['/logout']).then(() => null);
    }, 20000);
  }

  public getRefUser() {
    return this.refUser;
  }

  public getRawToken(): string {
    return this.token.raw;
  }

  public autologin(): boolean {
    if (this.getCurrentUser() !== undefined && !this.tokenIsExpired()) {
      // login successful
      // return true to indicate successful login
      // this.conf.message = 'Welcome ' + this.currentUser.userReferentialLight.userEmail;
      // notify(this.conf, 'success', 1500);
      console.log('login success');
      return true;
    } else {
      // // return false to indicate failed login
      // this.conf.message = 'An error occurred';
      // notify(this.conf, 'error', 1);
      console.log('login failiure');
      return false;
    }
  }

  // Récupération du Token ou redirection vers la page d'authentification
  public connectWithSmart(forceAuthentification?: boolean): Promise<boolean> {
    return new Promise((resolve, reject: any) => {
      const apiTokenInUri = this.router.parseUrl(this.router.url).queryParams.token;
      // set url
      if (!forceAuthentification && apiTokenInUri) {
        // SI l'url contient ?token=....  on positionne et stocke ce token
        // SET TOKEN
        this.token = apiTokenInUri;
        sessionStorage.setItem('id_token', this.token.raw);
        return resolve(true);
      } else if (!this.token) {
        // Si l'on utilise oAuth
        // SI l'url contient #id_token=.... on peut recuperer
        // l'api token a partir de ce token issu de OneLogin
        const a = location.href.split('#');
        if (a.length > 1 && a[1].match(/id_token=/)) {
          return this.getApiToken(a, resolve, reject);
        } else {
          // Sinon on redirige vers l'URL OneLogin
          window.location.href = AuthenticationService.getClassicAuthURL();
          return resolve(false);
        }
      }
    });
  }

  /**
   * Logout - remove user info in local storage
   */
  public logout(): void {
    const obs = this.removeToken();
    if (typeof obs !== 'boolean') {
      obs.subscribe(
        result => {
          if (result) {
            this.clearSessionStorage();
            // delete all roles from applications
            this.permissionService.flushPermissions();
          } else {
            // this.conf.message = 'Session not closed, please try again';
            // notify(this.conf, 'error', 2000);
            console.log('error line 376');
            this.showConnectBtn = false;
          }
        },
        () => {
          // this.conf.message = 'Session already removing';
          // notify(this.conf, 'warning', 2000);
          console.log('error line 383');
        }
      );
    }
  }

  public hasAccess(route: any) {
    if (route.data !== null && route.data !== undefined && route.data.roles && this.getCurrentUser()) {
      return this.getCurrentUser().roles.some((role: any) =>
        route.data.roles.includes(role)
      );
    }
    return true;
  }

  public hasRights2(roles: any) {
    return this.permissionService.hasPermission(roles);
  }

  public isAdmin() {
    return this.hasRights(['ROLE_SUPER_ADMIN']);
  }

  public isLoggedIn() {
    const now = new Date();
    const exp = new Date(this.token.expirationDate);
    return localStorage.getItem('token') !== null || exp.getTime() > now.getTime();
  }

  public clearSessionStorage(msg?: string, color?: string): void {
    // let msgTmp: string = (msg) ? msg : `Have a good day :)`;
    // let colorTmp: string = (color) ? color : `warning`;
    // clear token remove user from local storage to log user out
    // @ts-ignore
    this.token = null;
    sessionStorage.removeItem('token');
    this.refUser = null;
    sessionStorage.removeItem('userGmad');
    // @ts-ignore
    this.currentUser = null;
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('connect');
    sessionStorage.clear();
    // this.conf.message = msgTmp;
    // notify(this.conf, 'info', 2000);
    this.showConnectBtn = true;
  }

  public decryptToken(token: string | null): boolean {
    if (token && token !== 'ERROR') {
      this.token = this.jwtHelper.decodeToken(token);
      this.token.expirationDate = this.jwtHelper.getTokenExpirationDate(token);
      this.token.isExpired = this.jwtHelper.isTokenExpired(token);
      this.token.raw = token;
      this.currentUser = this.token.user;

      // set permissions of user
      this.permissionService.loadPermissions(this.currentUser.roles);
      sessionStorage.setItem('token', this.token.raw);
      this.refUser = this.token.user.userReferentialLight;
      sessionStorage.setItem(
        'currentUser',
        JSON.stringify(this.token.user.userReferentialLight)
      );

      this.getTokenTimeLeft();
      this.countDownTokenAction();
      this.refreshInProgress = false;
      this.startChecking();
      return true;
    }
    return false;
  }

  public pingApi() {
    if (this.isIE === null) {
      const IEversion = this.detectIE();
      this.isIE = !!IEversion;
    }
    if (this.isIE) {
      this.http
        .post(API_URL + 'auth/pings', null, this.getRequestOptions())
        .subscribe(res => {
        });
      this.sleep(1000);
    }
  }
}
