import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

import { LoaderService } from '../../../services/loader.service';
import { DataService } from '../../../services/data.service';
import { AddUserComponent } from './add-user/add-user.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  searchText = '';

  users = [];
  p: number = 1;

  active = 'initiators';
  display = 'Initiators List';
  rolesList = [...JSON.parse(sessionStorage.getItem('roleList'))];

  subscription = new Subscription();

  constructor(
    public loader: LoaderService,
    private dataService: DataService,
    private dialog: MatDialog,
    private notifications: NotificationService
  ) { }

  ngOnInit(): void {
    this.tabClick('initiators');
  }

  ngOnDestroy() {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  tabClick(change: string) {
    let role;
    this.active = change;

    switch(change) {
      case 'initiators':
        role = this.getRole('initiator');
        this.display = 'Initiators List';
        break;

      case 'admins':
        role = this.getRole('admin');
        this.display = 'Admin List';
        break;

      default:
        role = this.getRole('reviewer');
        this.display = 'Reviewer List';
        break;
    }

    this.getUsers(role._id);
  }

  getRole(roleName: string) {
    return this.rolesList.find(r => r.name === roleName);
  }

  getUsers(roleId: string) {
    this.loader.showLoader();
    const uri = `${environment.users}/by-role`;
    const token = sessionStorage.getItem('token');

    this.subscription = this.dataService.get(uri, token, roleId).subscribe(response => {
      this.users = [...response];
      this.loader.hideLoader();
    });
  }

  addUser(user?) {
    window.scroll(0, 0);
    this.dialog.open(AddUserComponent, {
      width: '32rem',
      disableClose: true,
      data: user? user : null
    }).afterClosed().subscribe(result => {
      if (result) {
        this.tabClick(this.active);
      }
    });
  }

  resetPassword(user) {
    this.notifications.prompt(`Are you sure you want to reset ${user.name.toUpperCase()}'s password ?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();

        const uri = `${environment.users}/reset-password`;
        const token = sessionStorage.getItem('token');

        this.subscription = this.dataService.update(uri, user._id, {}, token).subscribe(response => {
          this.notifications.alert(`${user.name.toUpperCase()}'s password has been reset.<br/>New password: password`).then(r => {
            if (r.isConfirmed) {
              this.tabClick(this.active);
            }
          });
        });
      }
    });
  }
}
