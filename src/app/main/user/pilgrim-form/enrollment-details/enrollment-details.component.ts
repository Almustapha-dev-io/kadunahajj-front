import { LoaderService } from './../../../../services/loader.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '@environment';
import { Subscription, forkJoin } from 'rxjs';

import { DataService } from '../../../../services/data.service';
import { FormsService } from '../../../../services/forms.service';
import { StepModel } from '../../../../common/models/step.model';

@Component({
  selector: 'app-enrollment-details',
  templateUrl: './enrollment-details.component.html',
  styleUrls: ['./enrollment-details.component.scss']
})
export class EnrollmentDetailsComponent implements OnInit, OnDestroy {
  @Input('step') step: StepModel;

  lga = [];
  years = [];
  seats = [];

  lgLoader = false;
  showLga = false;

  passportTypes = ['normal', 'official', 'diplomatic'];

  enrollmentAndPassport: FormGroup;
  userLga = sessionStorage.getItem('localGov');

  subscription: Subscription = new Subscription();

  constructor(
    private formsService: FormsService,
    private dataService: DataService,
    public loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.enrollmentAndPassport = this.formsService.enrollmentAndPassport;

    this.fetchOptions();
    if (this.enrollmentAllocationNumber.value) {
      this.showLga = true;
      this.seats = [...JSON.parse(sessionStorage.getItem('seatsArray'))];
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loader.hideLoader();
  }

  valueChange() {
    this.formsService.enrollmentAndPassport$.next(this.enrollmentAndPassport);
    this.enrollmentAndPassport = this.formsService.enrollmentAndPassport;

    this.step.isComplete = this.enrollmentAndPassport.valid;
  }

  fetchOptions() {
    this.loader.showLoader();
    const token = sessionStorage.getItem('token');
    const zonesUri = `${environment.zones}`;
    const yearsUri = `${environment.years}/get-active/all`;

    this.subscription = forkJoin([
      this.dataService.get(zonesUri, token, this.userLga),
      this.dataService.get(yearsUri, token)
    ])
    .subscribe(response => {
      const [zone, years] = response;
      this.years = [...years];
      this.lga.push(zone);

      this.enrollmentDetailsForm.patchValue({
        enrollmentZone: zone._id
      });

      this.valueChange();
      this.loader.hideLoader();
    });
  }

  getYearId(yearName) {
    const year = this.years.find(y => y.year === yearName);
    return year._id;
  }

  getYearAllocations(yearName) {
    const year = this.years.find(y => y.year === yearName);
    const zoneDetails = year.seatAllocations.find(s => s.zone === this.lga[0]._id);
    return zoneDetails ? zoneDetails.seatsAllocated : 0;
  }

  yearSelected() {
    this.enrollmentAllocationNumber.reset('');

    this.lgLoader = true;
    const token = sessionStorage.getItem('token');
    const seatsUri = `${environment.seats}/taken/${this.lga[0]._id}/${this.getYearId(this.enrollmentYear.value)}`;

    this.subscription = this.dataService
      .get(seatsUri, token)
      .subscribe(response => {

        const takenSeats = response;

        const allSeats = this.getYearAllocations(this.enrollmentYear.value);
        this.seats.length = 0;

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

        sessionStorage.setItem('seatsArray', JSON.stringify(this.seats));
        this.lgLoader = false;
        this.showLga = true;
      });

    this.valueChange();
  }

  get currentYear() {
    return new Date().getFullYear();
  }

  // Enrollment Details Form Getters
  get enrollmentDetailsForm(): FormGroup {
    return this.enrollmentAndPassport.get('enrollmentDetails') as FormGroup;
  }

  get hajjExperience() {
    return this.enrollmentDetailsForm.get('hajjExperience');
  }

  get lastHajjYear() {
    return this.enrollmentDetailsForm.get('lastHajjYear');
  }

  get enrollmentZone() {
    return this.enrollmentDetailsForm.get('enrollmentZone');
  }

  get enrollmentYear() {
    return this.enrollmentDetailsForm.get('enrollmentYear');
  }

  get enrollmentAllocationNumber() {
    return this.enrollmentDetailsForm.get('enrollmentAllocationNumber');
  }

  // Passport Details Form Getters
  get passportDetailsForm(): FormGroup {
    return this.enrollmentAndPassport.get('passportDetails') as FormGroup;
  }

  get passportType() {
    return this.passportDetailsForm.get('passportType');
  }

  get passportNumber() {
    return this.passportDetailsForm.get('passportNumber');
  }

  get placeOfIssue() {
    return this.passportDetailsForm.get('placeOfIssue');
  }

  get dateOfIssue() {
    return this.passportDetailsForm.get('dateOfIssue');
  }

  get expiryDate() {
    return this.passportDetailsForm.get('expiryDate');
  }
}
