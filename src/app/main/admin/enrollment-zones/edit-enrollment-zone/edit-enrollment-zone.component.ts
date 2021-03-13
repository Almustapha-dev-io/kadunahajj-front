import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { DataService } from '../../../../services/data.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-edit-enrollment-zone',
  templateUrl: './edit-enrollment-zone.component.html',
  styleUrls: ['./edit-enrollment-zone.component.scss']
})
export class EditEnrollmentZoneComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  token = sessionStorage.getItem('token');

  zoneName = '';
  zoneCode = '';

  constructor(
    public loader: ModalLoaderService,
    private dataService: DataService,
    private dialogRef: MatDialogRef<EditEnrollmentZoneComponent>,
    private notifications: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.zoneName = this.data.name;
    this.zoneCode = this.data.code;
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  submit(f) {
    this.notifications.prompt('Save changes made?').then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = environment.zones;

        this.subscription = this.dataService.update(uri, this.data._id, f, this.token).subscribe(response => {
          this.notifications.successToast(`${response.name} (${response.code}) updated.`);
          this.loader.hideLoader();
          this.dialogRef.close(true);
        });
      }
    });
  }

}
