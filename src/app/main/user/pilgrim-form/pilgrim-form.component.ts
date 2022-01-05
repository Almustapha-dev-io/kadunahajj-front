import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from '@environment';

import { StepsService } from '../../../services/steps.service';

import { StepModel } from '../../../common/models/step.model';
import { NotificationService } from '../../../services/notification.service';
import { FormsService } from '../../../services/forms.service';
import { DataService } from '../../../services/data.service';
import { ModalLoaderService } from '../../../services/modal-loader.service';

@Component({
  selector: 'app-pilgrim-form',
  templateUrl: './pilgrim-form.component.html',
  styleUrls: ['./pilgrim-form.component.scss']
})
export class PilgrimFormComponent implements OnInit, OnDestroy {

  currentStep: Observable<StepModel>;
  subscription: Subscription = new Subscription();
  activeYear = [];
  fetchedYear = false;
  seats = [];

  constructor(
    private stepsService: StepsService,
    private notifications: NotificationService,
    private formsService: FormsService,
    private dataService: DataService,
    public loader: ModalLoaderService
  ) { }

  ngOnInit(): void {
    this.currentStep = this.stepsService.getCurrentStep();

    this.getActiveYear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loader.hideLoader();
  }

  onNextStep() {
    if (!this.stepsService.isLastStep()) {
      this.stepsService.moveToNextStep();
    } else {
      this.onSubmit();
    }
  }

  onPreviousStep() {
    this.stepsService.moveToPreviousStep();
  }

  showButtonLabel() {
    return !this.stepsService.isLastStep() ? 'Next' : 'Submit';
  }

  getActiveYear() {
    this.loader.showLoader();
    const token = sessionStorage.getItem('token');
    const uri = `${environment.years}/get-active/all`;

    this.subscription = this.dataService.get(uri, token).subscribe(response => {
      this.activeYear = [...response];
      this.fetchedYear = true;

      this.loader.hideLoader();
    });
  }

  get isLastStep() {
    let stepComplete = true;
    this.stepsService.getSteps().subscribe(steps => {
      steps.forEach(s => {
        if (!s.isComplete) stepComplete = false;
      });
    });
    return this.stepsService.isLastStep() && stepComplete;
  }

  resetForm() {
    this.formsService.reset();
    this.stepsService.reset();
  }

  onSubmit() {
    this.notifications.prompt('Are you sure you want to submit?').then(result => {
      if (result.isConfirmed) {

        this.loader.showLoader();
        const token = sessionStorage.getItem('token');
        const imageUri = `${environment.pilgrims}/image`;
        const uri = environment.pilgrims;

        this.subscription = this.dataService.post(imageUri, this.formsService.formData, token).subscribe(fileResponse => {
          this.notifications.successToast(`${fileResponse.message} Sending user data...`);
            console.log(this.formsService.formValue);
          this.subscription = this.dataService.post(uri, this.formsService.formValue, token).subscribe(response => {
            this.notifications.alert(`Pilgrim registered successfully. <br />Code: <b>${response.pilgrim.enrollmentDetails.code}</b>`).then(result => {
              this.formsService.reset();
              this.stepsService.reset();
              this.loader.hideLoader();
            });
          });
        });
      }
    });
  }

}
