import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

import { DataService } from '../../../../services/data.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { AddSeatAllocationsComponent } from '../add-seat-allocations/add-seat-allocations.component';
import { EditSeatComponent } from '../edit-seat/edit-seat.component';

@Component({
  selector: 'app-view-hajj-year',
  templateUrl: './view-hajj-year.component.html',
  styleUrls: ['./view-hajj-year.component.scss']
})
export class ViewHajjYearComponent implements OnInit, OnDestroy {

  token = sessionStorage.getItem('token');
  zones = [];
  subscription: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public loader: ModalLoaderService,
    private dataService: DataService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewHajjYearComponent>
  ) { }

  ngOnInit(): void {
    if (this.allowAddAllocation()) {
      this.getZones();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loader.hideLoader();
  }

  allowAddAllocation() {
    const currentYear = new Date().getFullYear();
    const yearToEdit =  parseInt(this.data.year);

    return (currentYear <= yearToEdit) && (this.data.seatAllocations.length < 23);
  }

  get totalSeats() {
    let sum = 0;
    this.data.seatAllocations.forEach(a => sum += +a.seatsAllocated);
    return sum;
  }

  getZones() {
    this.loader.showLoader();
    const uri = environment.zones;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      const exemptedZones = ['00', '01'];

      this.zones = response
        .filter(z => !exemptedZones.includes(z.code))
        .map(z => {
          const tempZone = this.data.seatAllocations.find(a => a.zone._id === z._id);
          if (tempZone) {
            z.exempted = true;
            return z;
          }

          z.exempted = false;
          return z;
        });

      this.loader.hideLoader();
    });
  }

  getYearDetails() {
    this.loader.showLoader();
    const uri = environment.years;
    this.subscription = this.dataService
      .get(uri, this.token, this.data._id)
      .subscribe(response => {
        this.data.seatAllocations.length = 0;
        this.data.seatAllocations = [...response.seatAllocations];
        console.log(this.data);
        this.loader.hideLoader();
      });
  }

  addSeatAllocation() {
    window.scroll(0, 0);
    this.dialog.open(AddSeatAllocationsComponent, {
      width: '42rem',
      disableClose: true,
      data: {
        zones: this.zones,
        yearId: this.data._id,
        remainingSlots: 23 - this.data.seatAllocations.length
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.getYearDetails();
      }
    });
  }

  editZoneSeats(allocation) {
    console.log(allocation);
    window.scroll(0, 0);
    this.dialog.open(EditSeatComponent, {
      width: '25rem',
      disableClose: true,
      data: {
        zone: {
          seatsAllocated: allocation.seatsAllocated,
          name: allocation.zone.name,
          _id: allocation.zone._id
        },
        yearId: this.data._id
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.getYearDetails();
      }
    });
  }
}
