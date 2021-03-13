import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataService } from '../services/data.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  loginSubscription = new Subscription();
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private dataService: DataService,
    public loader: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.loader.hideLoader();
    this.loginSubscription.unsubscribe();
  }

  submit(formValue) {
    this.loader.showLoader();
    const uri = `http://localhost:3000/api/auths`;

    this.loginSubscription = this.dataService.post(uri, formValue, '').subscribe(response => {
      this.loader.hideLoader();

      console.log(response);

      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('roleName', response.user.role.name);
      sessionStorage.setItem('roleId', response.user.role._id);
      sessionStorage.setItem('name', response.user.name);
      sessionStorage.setItem('email', response.user.email);

      if (response.user.role.name === 'super-admin') {
        this.router.navigate(['/app/admin']);
      }
    });
  }

}
