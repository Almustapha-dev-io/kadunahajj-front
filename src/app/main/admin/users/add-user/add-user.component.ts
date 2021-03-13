import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { DataService } from '../../../../services/data.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  @ViewChild('localGovernmentId') localGovernmentId: NgModel;

  action = 'Add New User';

  token = sessionStorage.getItem('token');
  rolesList = JSON.parse(sessionStorage.getItem('roleList')).filter(r => r.name != 'super-admin');
  zones = [];
  initiaitorZones = [];
  reviewerZone = [];
  emailPattern = environment.emailPattern;

  zonesSubscription = new Subscription();
  regSubscription = new Subscription();

  formName = '';
  formEmail = '';
  formRoleId = '';
  formLga = '';

  constructor(
    public loader: ModalLoaderService,
    private dataService: DataService,
    private dialogRef: MatDialogRef<AddUserComponent>,
    private notifications: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getLocalGovernments();

    if (this.data) {
      this.action = 'Edit User';

      this.formName = this.data.name;
      this.formEmail = this.data.email;
      this.formRoleId = this.data.role;
      this.formLga = this.data.localGovernment._id;
    }
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.zonesSubscription.unsubscribe();
    this.regSubscription.unsubscribe();
  }

  filterZones() {
    if (!this.data) {
      this.localGovernmentId.reset('');

      const reviewer = this.rolesList.find(r => r.name == 'reviewer');

      if (reviewer._id === this.formRoleId) this.zones = [...this.reviewerZone];

      else this.zones = [...this.initiaitorZones];
    }
  }

  getLocalGovernments() {
    this.loader.showLoader();
    const uri = environment.zones;

    this.zonesSubscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.loader.hideLoader();

      if (!this.data) {
        this.initiaitorZones = response.filter(z => z.code != '00' && z.code != '01');
        this.reviewerZone = response.filter(z => z.code == '01');
        return;
      }

      this.zones = [...response];
    });
  }

  submit(f: NgForm) {
    const message = this.data ? 'Save changes ?' : 'Create user?';

    this.notifications.prompt(message).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = environment.users;

        if (!this.data) {
          this.saveNewUser(f.value, uri);
        } else {
          this.updateExisting(this.data._id, uri);
        }
      }
    });
  }

  saveNewUser(data, uri) {
    this.regSubscription = this.dataService.post(uri, data, this.token).subscribe(response => {
      this.notifications.successToast('User created successfully.');
      this.loader.hideLoader();
      this.dialogRef.close(true);
    });
  }

  updateExisting(id, uri) {
    const req = {
      name: this.formName,
      email: this.formEmail,
      roleId: this.formRoleId,
      localGovernmentId: this.formLga
    };

    this.regSubscription = this.dataService.update(uri, id, req, this.token).subscribe(response => {
      this.notifications.successToast('User successfully updated.');
      this.loader.hideLoader();
      this.dialogRef.close(true);
    });
  }
}
