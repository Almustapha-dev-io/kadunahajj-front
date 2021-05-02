import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { CustomNameValidators } from '../../../../common/Validators/custom-name.validators';
import { YearValidators } from '../../../../common/Validators/year.vaalidators';
import { NotificationService } from '../../../../services/notification.service';
import { DataService } from '../../../../services/data.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-new-hajj-year',
  templateUrl: './new-hajj-year.component.html',
  styleUrls: ['./new-hajj-year.component.scss']
})
export class NewHajjYearComponent implements OnInit, OnDestroy {

  hajjYearForm: FormGroup;
  activeCollection: boolean[] = [true, false];
  zones = [];
  token = sessionStorage.getItem('token');

  subscription: Subscription = new Subscription();

  constructor(
    public loader: ModalLoaderService,
    private dataService: DataService,
    private notifications: NotificationService,
    private dialogRef: MatDialogRef<NewHajjYearComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getZones();
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  initializeForm() {
    this.hajjYearForm = this.fb.group({
      year: ['', [
        Validators.required,
        Validators.pattern(/^20[2-9]{1}[0-9]{1}$/),
        CustomNameValidators.cannotContainSpace,
        YearValidators.lessThanCurrentYear
      ]],
      active: [false],
      dateOpened: ['', [Validators.required, YearValidators.lessThanToday]],
      seatAllocations: new FormArray([])
    });
  }

  submit() {
    const req = {
      year: this.year.value,
      active: this.active.value,
      dateOpened: this.dateOpened.value,
      seatAllocations: [...this.seatAllocations.value]
    }

     this.notifications.prompt(`Open ${this.year.value} hajj?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.years}`;

        this.subscription = this.dataService.post(uri, req, this.token).subscribe(response => {
          console.log(response);
          this.notifications.successToast(`${response.year} hajj has been successfully opened.`);
          this.dialogRef.close(true);
        });
      }
    });
  }

  getZones() {
    this.loader.showLoader();
    const uri = environment.zones;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      const exemptedZones = ['00', '01'];

      this.zones = response
        .filter(z => !exemptedZones.includes(z.code))
        .map(z => {
          z.exempted = false;
          return z;
        });

      this.loader.hideLoader();
    });
  }

  get year() {
    return this.hajjYearForm.get('year');
  }

  get active() {
    return this.hajjYearForm.get('active');
  }

  get dateOpened() {
    return this.hajjYearForm.get('dateOpened');
  }

  get seatAllocations(): FormArray {
    return <FormArray>this.hajjYearForm.get('seatAllocations');
  }

  get seatAllocationForms(): FormGroup[] {
    return <FormGroup[]>(<FormArray>this.hajjYearForm.get('seatAllocations')).controls;
  }

  addSeatAllocation() {
    if (this.seatAllocationForms.length === 23) {
      return this.notifications.alert('You\' allocated seats to all centers.');
    }

    this.seatAllocations.push(this.fb.group({
      zone: ['', Validators.required],
      seatsAllocated: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(0)]
      ]
    }));
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
}
