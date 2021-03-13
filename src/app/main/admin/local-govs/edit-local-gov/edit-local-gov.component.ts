import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { DataService } from '../../../../services/data.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-edit-local-gov',
  templateUrl: './edit-local-gov.component.html',
  styleUrls: ['./edit-local-gov.component.scss']
})
export class EditLocalGovComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  token = sessionStorage.getItem('token');

  lgaName = '';

  constructor(
    public loader: ModalLoaderService,
    private dataService: DataService,
    private dialogRef: MatDialogRef<EditLocalGovComponent>,
    private notifications: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.lgaName = this.data.name;
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  submit(f) {
    this.notifications.prompt('Save changes made?').then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = environment.lgas;

        this.subscription = this.dataService.update(uri, this.data._id, f, this.token).subscribe(response => {
          this.notifications.successToast(`${response.name} LGA has been updated.`);
          this.loader.hideLoader();
          this.dialogRef.close(true);
        });
      }
    });
  }

}
