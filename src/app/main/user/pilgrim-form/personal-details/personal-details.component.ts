import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

import { LoaderService } from '../../../../services/loader.service';
import { DataService } from '../../../../services/data.service';
import { FormsService } from '../../../../services/forms.service';
import { StepModel } from '../../../../common/models/step.model';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit, OnDestroy {

  @Input('step') step: StepModel;

  states = [];
  lgas = [];
  maritalStatuses = ['single', 'married', 'divorced', 'widow', 'widower'];

  token = sessionStorage.getItem('token');

  personalAndOffice: FormGroup;
  subscription: Subscription = new Subscription();

  lgLoader = false;
  showLga = false;

  constructor(
    private formsService: FormsService,
    private dataService: DataService,
    public loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.personalAndOffice = this.formsService.personalAndOffice;

    this.getStates();
    if (this.localGovOfOrigin.value) {
      this.showLga = true;
      this.lgas = [...JSON.parse(sessionStorage.getItem('formLg'))];
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loader.hideLoader();
  }

  valueChange(stateChanged?) {
    if (stateChanged) {
      this.getLocalGovs(this.stateOfOrigin.value);
    }

    this.formsService.personalAndOffice$.next(this.personalAndOffice);
    this.personalAndOffice = this.formsService.personalAndOffice;

    this.step.isComplete = this.personalAndOffice.valid;
  }

  getStates() {
    this.loader.showLoader();
    const uri = environment.states;

    this.subscription = this.dataService.get(uri, this.token, '').subscribe(response => {
      this.states = response.filter(s => s.name !== 'default');
      this.loader.hideLoader();
    });
  }

  getLocalGovs(stateId) {
    this.lgLoader = true;
    const uri = `${environment.lgas}/by-state`;
    this.subscription = this.dataService.get(uri, this.token, stateId).subscribe(response => {
      this.lgas = [...response];

      sessionStorage.setItem('formLg', JSON.stringify(this.lgas));
      this.lgLoader = false;
      this.showLga = true;
    });
  }

  // Personal Fetails Form Getters
  get personalDetailsForm(): FormGroup {
    return this.personalAndOffice.get('personalDetails') as FormGroup;
  }

  get surname() {
    return this.personalDetailsForm.get('surname');
  }

  get otherNames() {
    return this.personalDetailsForm.get('otherNames');
  }

  get sex() {
    return this.personalDetailsForm.get('sex');
  }

  get maritalStatus() {
    return this.personalDetailsForm.get('maritalStatus');
  }

  get homeAddress() {
    return this.personalDetailsForm.get('homeAddress');
  }

  get stateOfOrigin() {
    return this.personalDetailsForm.get('stateOfOrigin');
  }

  get localGovOfOrigin() {
    return this.personalDetailsForm.get('localGovOfOrigin');
  }

  get dateOfBirth() {
    return this.personalDetailsForm.get('dateOfBirth');
  }

  get phone() {
    return this.personalDetailsForm.get('phone');
  }

  get alternatePhone() {
    return this.personalDetailsForm.get('alternatePhone');
  }
  
  get email() {
    return this.personalDetailsForm.get('email');
  }

  // Office Details Form Getters
  get officeDetailsForm(): FormGroup {
    return this.personalAndOffice.get('officeDetails') as FormGroup;
  }

  get occupation() {
    return this.officeDetailsForm.get('occupation');
  }

  get placeOfWork() {
    return this.officeDetailsForm.get('placeOfWork');
  }

  get officeAddress() {
    return this.officeDetailsForm.get('officeAddress');
  }

  get profession() {
    return this.officeDetailsForm.get('profession');
  }

}
