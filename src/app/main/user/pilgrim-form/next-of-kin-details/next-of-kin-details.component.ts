import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormsService } from '../../../../services/forms.service';
import { StepModel } from '../../../../common/models/step.model';

@Component({
  selector: 'app-next-of-kin-details',
  templateUrl: './next-of-kin-details.component.html',
  styleUrls: ['./next-of-kin-details.component.scss']
})
export class NextOfKinDetailsComponent implements OnInit {
  @Input('step') step: StepModel;

  relationships = ['mother', 'father', 'sibling', 'grand parent', 'uncle',
  'aunt', 'cousin', 'niece', 'nephew', 'child', 'spouse'];

  nextOfKinDetailsForm: FormGroup;
  mahrimDetailsForm: FormGroup;

  constructor(private formsService: FormsService) { }

  ngOnInit(): void {
    this.nextOfKinDetailsForm = this.formsService.nextOfKinDetails;
    this.mahrimDetailsForm = this.formsService.mahrimDetails;
   
    this.formsService.personalAndOffice.get('personalDetails').valueChanges.subscribe(this.valueChange);
  }

  valueChange() {
    this.formsService.nextOfKinDetails$.next(this.nextOfKinDetailsForm);
    this.nextOfKinDetailsForm = this.formsService.nextOfKinDetails;

    this.formsService.mahrimDetails$.next(this.mahrimDetailsForm);
    this.mahrimDetailsForm = this.formsService.mahrimDetails;

    let isValid = this.nextOfKinDetailsForm.valid;
    if (!this.isMale) {
      isValid = isValid && this.mahrimDetailsForm.valid;
    }
    this.step.isComplete = isValid;
  }

  get isMale() {
    const personalDetails = this.formsService.personalAndOffice.value.personalDetails;
    return personalDetails.sex === 'male';
  }
  // Next of Kin Details from getters
  get fullName() {
    return this.nextOfKinDetailsForm.get('fullName');
  }

  get relationship() {
    return this.nextOfKinDetailsForm.get('relationship');
  }

  get address() {
    return this.nextOfKinDetailsForm.get('address');
  }

  get phone() {
    return this.nextOfKinDetailsForm.get('phone');
  }

  // Next of Kin Details from getters
  get mahrimFullName() {
    return this.mahrimDetailsForm.get('fullName');
  }

  get mahrimRelationship() {
    return this.mahrimDetailsForm.get('relationship');
  }

  get mahrimAddress() {
    return this.mahrimDetailsForm.get('address');
  }

  get mahrimPhone() {
    return this.mahrimDetailsForm.get('phone');
  }
}
