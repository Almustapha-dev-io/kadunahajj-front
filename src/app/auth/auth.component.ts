import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

import { DataService } from '../services/data.service';
import { GuardsService } from '../services/guards.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  loginSubscription = new Subscription();
  emailPattern = environment.emailPattern;

  constructor(
    private dataService: DataService,
    public loader: LoaderService,
    private guardService: GuardsService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.setTitle('Log in')
  }

  ngOnDestroy() {
    this.loader.hideLoader();
    this.loginSubscription.unsubscribe();
  }

  submit(formValue) {
    this.loader.showLoader();
    const uri = environment.auth;

    this.loginSubscription = this.dataService.post(uri, formValue, '').subscribe(response => {
      this.loader.hideLoader();

      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('roleName', response.user.role.name);
      sessionStorage.setItem('roleId', response.user.role._id);
      sessionStorage.setItem('name', response.user.name);
      sessionStorage.setItem('email', response.user.email);
      sessionStorage.setItem('userId', response.user._id);
      sessionStorage.setItem('firstLogin', response.user.firstLogin);
      sessionStorage.setItem('localGov', response.user.localGovernment);

      this.navigateUser(response.user.role.name);
    });
  }

  setTitle(title) {
    this.titleService.setTitle(title);
  }

  navigateUser(userRole) {
    this.guardService.isLoggedIn = true;

    switch(userRole) {
      case 'super-admin':
        this.guardService.isSuperAdmin = true;
        sessionStorage.setItem('isAdmin', 'true');
        this.router.navigate(['/app', 'admin']);
        this.setTitle('Super Administrator Module');
        break;

      case 'initiator':
        this.guardService.isInitiator = true;
        sessionStorage.setItem('isInitiator', 'true');
        this.router.navigate(['/app', 'user']);
        this.setTitle('Initiator Module');
        break;

      case 'admin':
        this.guardService.isUserAdmin = true;
        sessionStorage.setItem('isUserAdmin', 'true');
        this.router.navigate(['/app', 'user', 'dashboard']);
        this.setTitle('User Administrator Module');
        break;

      case 'reviewer':
        this.guardService.isReviewer = true;
        sessionStorage.setItem('isReviewer', 'true');
        this.router.navigate(['/app', 'user', 'dashboard']);
        this.setTitle('Reviewer Module');
        break;

      default:
        this.guardService.reset();
        sessionStorage.clear();
        break;
    }
  }

}
