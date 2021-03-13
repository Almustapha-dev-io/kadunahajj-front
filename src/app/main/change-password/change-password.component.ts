import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { NotificationService } from '../../services/notification.service';
import { DataService } from '../../services/data.service';
import { ModalLoaderService } from '../../services/modal-loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  firstLogin = sessionStorage.getItem('firstLogin') === 'true' ? true : false;
  userId = sessionStorage.getItem('userId');
  subscription = new Subscription();

  currentPass = '';
  pass = '';
  confirmPass = '';

  constructor(
    public loader: ModalLoaderService,
    private dataService: DataService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private notifications: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  submit(f) {
    this.notifications.prompt('Change password ?').then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const token = sessionStorage.getItem('token');
        const uri = `${environment.users}/change-password`;

        const req = { password: f.password, currentPassword: f.currentPassword };

        this.subscription = this.dataService.update(uri, this.userId, req, token).subscribe(response => {
          this.loader.hideLoader();

          sessionStorage.clear();
          this.notifications.successToast('Password changed. Please Login.');
          this.dialogRef.close();
          this.router.navigateByUrl('/');
        });
      }
    });
  }
}
