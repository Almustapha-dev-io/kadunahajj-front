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

  constructor(private formsService: FormsService) { }

  ngOnInit(): void {
    this.nextOfKinDetailsForm = this.formsService.nextOfKinDetails;
  }

  valueChange() {
    this.formsService.nextOfKinDetails$.next(this.nextOfKinDetailsForm);
    this.nextOfKinDetailsForm = this.formsService.nextOfKinDetails;

    this.step.isComplete = this.nextOfKinDetailsForm.valid;
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
}
