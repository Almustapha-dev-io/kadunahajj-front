import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

import { LoaderService } from '../../../../services/loader.service';
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

    this.getLocalGovernment();
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

  getLocalGovernment() {
    this.loader.showLoader();
    const uri = `${environment.zones}`;
    const token = sessionStorage.getItem('token');

    this.subscription = this.dataService.get(uri, token, this.userLga).subscribe(response => {
      this.lga.push(response);

      this.enrollmentDetailsForm.patchValue({
        enrollmentZone: response._id
      });

      this.valueChange();
      this.loader.hideLoader();
    })
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
