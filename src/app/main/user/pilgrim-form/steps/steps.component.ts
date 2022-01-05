import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { StepsService } from '../../../../services/steps.service';

import { StepModel } from '../../../../common/models/step.model';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {

  steps: Observable<StepModel[]>;
  currentStep: Observable<StepModel>;

  constructor(private stepsService: StepsService) { }

  ngOnInit(): void {
    this.steps = this.stepsService.getSteps();
    this.currentStep = this.stepsService.getCurrentStep();
  }

  onStepClick(step: StepModel) {
    let steps: StepModel[];
    this.steps.subscribe(st => {
      steps = st;
    });

    let previousIndex = step.stepIndex - 2;

    if (step.stepIndex === 1) {
      this.stepsService.setCurrentStep(step);
      return;
    }

    // if (!steps[previousIndex].isComplete) {
    //   return;
    // }
    this.stepsService.setCurrentStep(step);
  }

  stepIndex(stepIndex) {
    let display = '';

    switch (stepIndex) {
      case 1:
        display = 'Enrollment & Passport';
        break;

      case 2:
        display = 'Personal Details';
        break;

      case 3:
        display = 'Next of Kin & Mahrim';
        break;

      case 4:
        display = 'Document Upload'
        break;

      case 5:
        display = 'Payment History'
        break;
    }

    return display;
  }

}
