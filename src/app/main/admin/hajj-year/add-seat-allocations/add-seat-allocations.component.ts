import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../../services/notification.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { DataService } from '../../../../services/data.service';
import { environment } from '@environment';


@Component({
  selector: 'app-add-seat-allocations',
  templateUrl: './add-seat-allocations.component.html',
  styleUrls: ['./add-seat-allocations.component.scss']
})
export class AddSeatAllocationsComponent implements OnInit, OnDestroy {

  seatAllocations: FormArray;
  zones = [];
  token = sessionStorage.getItem('token');

  subscription: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public loader: ModalLoaderService,
    private notifications: NotificationService,
    private dialogRef: MatDialogRef<AddSeatAllocationsComponent>,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.zones = [...this.data.zones];

    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  initializeForm() {
    this.seatAllocations = new FormArray([this.form]);
  }

  submit() {
    const req = {
      seatAllocations: this.seatAllocations.value
    };

    this.notifications.prompt('Are you sure you want to proceed?').then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.years}/add-allocation`;

        this.subscription = this.dataService
          .update(uri, this.data.yearId, req, this.token)
          .subscribe(response => {
            this.loader.hideLoader();
            this.notifications.successToast('Seats allocated to center successfully.');
            this.dialogRef.close(true);
          });
      }
    });
  }

  addSeatAllocation() {
    if (this.seatAllocationForms.length === this.data.remainingSlots) {
      return this.notifications.alert('You\'ve allocated seats to all centers for this year.');
    }

    this.seatAllocations.push(this.form);
  }

  removeSeatAllocation(i) {
    const removedAllocation = this.seatAllocations.controls.splice(i, 1);

    this.zones.forEach(z => {
      if (z._id === removedAllocation[0].get('zone').value) {
        z.exempted = false;
        z.controlIndex = undefined;
      }
    });
  }

  exemptZone(zoneId, formIndex) {
    const zone = this.zones.find(z => z._id === zoneId);

    if (zone.exempted) {
      this.notifications.alert(`${zone.name} has been allocated already`);
      this.seatAllocationForms[formIndex].reset('');
      return;
    }

    let previousZone = this.zones.find(z => z.controlIndex === formIndex);
    if (previousZone) {
      previousZone.exempted = false;
      previousZone.controlIndex = undefined;
    }

    zone.exempted = true;
    zone.controlIndex = formIndex;
  }

  get seatAllocationForms(): FormGroup[] {
    return <FormGroup[]>(this.seatAllocations).controls;
  }

  get form(): FormGroup {
    return this.fb.group({
      zone: ['', Validators.required],
      seatsAllocated: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(0)]
      ]
    });
  }

  get formValid() {
    return this.seatAllocationForms.every(f => f.valid === true);
  }

}
