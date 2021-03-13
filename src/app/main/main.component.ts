import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { DataService } from '../services/data.service';
import { LoaderService } from '../services/loader.service';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  userRole = sessionStorage.getItem('roleName');
  token = sessionStorage.getItem('token');
  firstLogin = sessionStorage.getItem('firstLogin') === 'true' ? true : false;

  subscription = new Subscription();

  constructor(
    private dataService: DataService,
    public loader: LoaderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.firstLogin) {
      this.changePasswordDialog();
    }

    if (this.userRole === 'super-admin') {
      this.getRoles();
    }
  }

  ngOnDestroy(): void {
    this.loader.mainLoader = false;
    this.subscription.unsubscribe();
  }

  getRoles() {
    this.loader.mainLoader = true;
    const uri = environment.roles;
    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.loader.mainLoader = false;
      sessionStorage.setItem('roleList', JSON.stringify(response));
    });
  }

  changePasswordDialog() {
    window.scroll(0, 0);
    this.dialog.open(ChangePasswordComponent, {
      width: '28rem',
      disableClose: true
    });
  }

}
