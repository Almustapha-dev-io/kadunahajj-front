import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { DataService } from '../../../../services/data.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-edit-bank',
  templateUrl: './edit-bank.component.html',
  styleUrls: ['./edit-bank.component.scss']
})
export class EditBankComponent implements OnInit, OnDestroy {

  action = 'Add New Bank'
  subscription = new Subscription();
  token = sessionStorage.getItem('token');

  bankName = '';

  constructor(
    public loader: ModalLoaderService,
    private dataService: DataService,
    private dialogRef: MatDialogRef<EditBankComponent>,
    private notifications: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    if (this.data) {
      this.action = 'Edit Bank';

      this.bankName = this.data.name;
    }
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  submit(f) {
    const message = this.data ? 'Save changes?' : 'Create bank?';

    this.notifications.prompt(message).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = environment.banks;

        if (!this.data) {
          this.saveNewBank(f, uri);
        } else {
          this.updateExisting(this.data._id, uri, f);
        }
      }
    });
  }

  saveNewBank(data, uri) {
    this.subscription = this.dataService.post(uri, data, this.token).subscribe(response => {
      this.notifications.successToast(`${response.name} created successfully.`);
      this.loader.hideLoader();
      this.dialogRef.close(true);
    });
  }

  updateExisting(id, uri, req) {
    this.subscription = this.dataService.update(uri, id, req, this.token).subscribe(response => {
      this.notifications.successToast(`${response.name} successfully updated.`);
      this.loader.hideLoader();
      this.dialogRef.close(true);
    });
  }

}
