import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { User } from '../../services/entities/models';

@Component({
  selector: 'app-login-component',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';
  success = '';
  private currentUser: User;

  constructor(
    // private cdr: ChangeDetectorRef,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  // onInit try to autologin with SmartV1
  ngOnInit() {
    this.loading = true;
    // reset login status
    if (window.navigator.userAgent !== 'fakeAgent') {
      this.tryConnect();
    }
  }

  finishedOnError(err: string) {
    this.error = err;
    this.loading = false;
  }

  tryConnect(withLogout?: boolean) {
    this.error = '';
    this.loading = true;

    let rawToken;
    if (this.router.url.split('#')[1]) {
      rawToken = this.router.url.split('#')[1].split('=')[1];
    }
    if (!withLogout && rawToken) {
      // if already redirect by Smart with token params
      this.connectWithSmart(); // SET TOKEN
    } else {
      // else logout and try to connect with Smart
      this.authenticationService.logout(); // LOGOUT
      this.connectWithSmart(withLogout); // TRY TO CONNECT WITH SMART V1
    }
  }

  connectWithSmart(withLogout?: boolean) {
    this.error = '';
    this.loading = true;
    this.authenticationService
      .connectWithSmart(withLogout)
      .then(tokenFound => {
        if (tokenFound) {
          this.autologin();
        }
        this.loading = false;
      })
      .catch(err => {
        this.finishedOnError(err);
      });
  }

  private autologin() {
    if (this.authenticationService.autologin()) {
      // login successful
      this.success = 'Connected';
      this.currentUser = this.authenticationService.getCurrentUser();
      // console.info('autologin', this.userLogged);
      this.router.navigate([this.authenticationService.homePageUrl]);
    } else {
      // login failed
      this.error = 'User not found';
      this.loading = false;
    }
    localStorage.removeItem('afterlogin');
    localStorage.removeItem('afterloginparams');
  }
}
