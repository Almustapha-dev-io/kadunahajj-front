import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

import { LoaderService } from '../../../../services/loader.service';
import { DataService } from '../../../../services/data.service';
import { FormsService } from '../../../../services/forms.service';
import { StepModel } from '../../../../common/models/step.model';
import { NotificationService } from '../../../../services/notification.service';
import { YearValidators } from 'src/app/common/Validators/year.vaalidators';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit, OnDestroy {

  @Input('step') step: StepModel;
  banks = [];

  token = sessionStorage.getItem('token');
  paymentHistory: FormArray
  subscription: Subscription = new Subscription();

  constructor(
    private formsService: FormsService,
    private dataService: DataService,
    public loader: LoaderService,
    private notifications: NotificationService
  ) { }

  ngOnInit(): void {
    this.paymentHistory = this.formsService.paymentHistory;

    this.getBanks();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loader.hideLoader();
  }

  valueChange() {
    this.formsService.paymentHistory$.next(this.paymentHistory);
    this.paymentHistory = this.formsService.paymentHistory;

    this.step.isComplete = this.paymentHistory.controls.every(c => c.valid);
  }

  getBanks() {
    this.loader.showLoader();
    const uri = environment.banks;

    this.subscription = this.dataService.get(uri, this.token, '').subscribe(response => {
      this.banks = [...response];
      this.loader.hideLoader();
    });
  }

  addFormGroup() {
    if (this.paymentHistory.controls.length >= 10) {
      this.notifications.alert('Sorry only a maximum of 10 payment records is allowed.');
    } else {
      this.paymentHistory.push(new FormGroup({
        bank: new FormControl(null, Validators.required),
        tellerNumber: new FormControl(null, Validators.required),
        receiptNumber: new FormControl(null, Validators.required),
        paymentDate: new FormControl(null, [Validators.required, YearValidators.greaterThanToday]),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)])
      }));

      this.valueChange();
    }
  }

  removeFormGroup(index) {
    this.paymentHistory.controls.splice(index, 1);
    this.valueChange();
  }

}
