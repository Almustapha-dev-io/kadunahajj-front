import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

import { DataService } from '../../../../services/data.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-edit-seat',
  templateUrl: './edit-seat.component.html',
  styleUrls: ['./edit-seat.component.scss']
})
export class EditSeatComponent implements OnInit, OnDestroy {

  seatNumber = '';
  token = sessionStorage.getItem('token');
  subscription: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public loader: ModalLoaderService,
    private dataService: DataService,
    private notifications: NotificationService,
    private dialogRef: MatDialogRef<EditSeatComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.seatNumber = this.data.zone.seatsAllocated;
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  saveChanges() {
    this.loader.showLoader();
    const req = {
      zone: this.data.zone._id,
      seatsAllocated: this.seatNumber
    };

    this.notifications.prompt('Are you sure you want to save these changes?').then(result => {
      if (result.isConfirmed) {
        const uri = `${environment.years}/edit-seat-allocation`;

        this.subscription = this.dataService
          .update(uri, this.data.yearId, req, this.token)
          .subscribe(response => {
            this.loader.hideLoader();
            this.notifications.successToast('Changes have been saved successfully.');

            this.dialogRef.close(true);
          })
      }
    })

  }

}
