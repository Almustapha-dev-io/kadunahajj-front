import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environment';
import { forkJoin, Subscription } from 'rxjs';

import { DataService } from '../../../../services/data.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-restore-pilgrim',
  templateUrl: './restore-pilgrim.component.html',
  styleUrls: ['./restore-pilgrim.component.scss']
})
export class RestorePilgrimComponent implements OnInit {

  seatNumber = '';
  seats = [];

  zone = sessionStorage.getItem('localGov');
  token = sessionStorage.getItem('token');

  subscription: Subscription = new Subscription();

  constructor(
    public loader: ModalLoaderService,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RestorePilgrimComponent>,
    private notifications: NotificationService
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loader.hideLoader();
  }

  fetchData() {
    this.loader.showLoader();
    const yearId = this.data.enrollmentDetails.enrollmentYear._id;

    const yearUri = environment.years;
    const seatsUri = `${environment.seats}/taken/${this.zone}/${yearId}`;

    this.subscription = forkJoin([
      this.dataService.get(yearUri, this.token, yearId),
      this.dataService.get(seatsUri, this.token)
    ])
    .subscribe(response => {
      this.loader.hideLoader();
      const [year, takenSeats] = response;

      const allSeats = year.seatAllocations.find(s => s.zone._id === this.zone).seatsAllocated;

      for (let i = 1; i <= allSeats; i++) {
        this.seats.push(i);
      }

      this.seats.forEach(s => {
        takenSeats.forEach(ts => {
          if (ts.seatNumber === s) {
            const index =  this.seats.findIndex(a => a === s);
            this.seats.splice(index, 1);
          }
        });
      });
    });
  }

  get max() {
    return this.seats[this.seats.length-1];
  }

  submit(formValue) {
    const req = {
      enrollmentDetails: {
        enrollmentAllocationNumber: formValue.slotNumber
      }
    };
    const uri = `${environment.pilgrims}/assign-seat`;
    this.notifications.prompt('Are you sure you want proceed?').then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        this.subscription = this.dataService
          .update(uri, this.data._id, req, this.token)
          .subscribe(response => {
            this.notifications.successToast('Pilgrim restored successfully.');

            this.loader.hideLoader();
            this.dialogRef.close(true);
          });
      }
    });
  }

}
