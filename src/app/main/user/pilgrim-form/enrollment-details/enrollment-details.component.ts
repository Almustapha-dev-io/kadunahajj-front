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
  states = [];

  token = sessionStorage.getItem('token');
  userLga = sessionStorage.getItem('localGov');
  lgLoader = false;
  showLga = false;
  passportTypes = ['normal', 'official', 'diplomatic'];
  passportDetailsForm: FormGroup;
  hajjExperienceShown = false;
  subscription: Subscription = new Subscription();

  constructor(
    private formsService: FormsService,
    private dataService: DataService,
    public loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.getStates();
    this.passportDetailsForm = this.formsService.passportDetails;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loader.hideLoader();
  }

  valueChange() {
    this.formsService.passportDetails$.next(this.passportDetailsForm);
    this.passportDetailsForm = this.formsService.passportDetails;

    this.step.isComplete = this.passportDetailsForm.valid;
  }

  getStates() {
    this.loader.showLoader();
    const uri = environment.states;

    this.subscription = this.dataService.get(uri, this.token, '').subscribe(response => {
      this.states = response.filter(s => s.name !== 'default');
      this.loader.hideLoader();
    });
  }

  get currentYear() {
    return new Date().getFullYear();
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
