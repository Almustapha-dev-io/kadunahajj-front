import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ModalLoaderService } from '../../../services/modal-loader.service';
import { DataService } from '../../../services/data.service';
import { environment } from '@environment';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { YearValidators } from 'src/app/common/Validators/year.vaalidators';
import { NotificationService } from 'src/app/services/notification.service';
import { FormsService } from 'src/app/services/forms.service';
import * as moment from 'moment';

@Component({
    selector: 'app-edit-hajj-allocation',
    templateUrl: './edit-hajj-allocation.component.html',
    styleUrls: ['./edit-hajj-allocation.component.scss']
})
export class EditHajjAllocationComponent implements OnInit {
    paymentHistory = [];
    banks = [];
    subscription = new Subscription();
    editAllocationForm: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataService: DataService,
        private formsService: FormsService,
        public loader: ModalLoaderService,
        private fb: FormBuilder,
        private notifications: NotificationService,
        private dialogRef: MatDialogRef<EditHajjAllocationComponent>
    ) { }

    ngOnInit(): void {
        this.editAllocationForm = this.fb.group({
            paymentHistory: this.fb.array([])
        });

        this.getBanks();
        this.paymentHistory = this.data.paymentHistory;
        const paymentHistory = this.editAllocationForm.get('paymentHistory') as FormArray;
        this.paymentHistory.forEach(payment => paymentHistory.push(this.getPaymentHistoryForm(payment)));

        console.log(this.editAllocationForm.value)
    }

    getPaymentHistoryForm(data?) {
        return this.fb.group({
            bank: [data && data.bank ? data.bank : '', Validators.required],
            tellerNumber: [data && data.tellerNumber ? data.tellerNumber : '', Validators.required],
            receiptNumber: [data && data.receiptNumber ? data.receiptNumber : '', Validators.required],
            paymentDate: [data && data.paymentDate ? moment(data.paymentDate).format('YYYY-MM-DD') : '', [Validators.required, YearValidators.greaterThanToday]],
            amount: [data && data.amount ? data.amount : '', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
        });
    }

    addPaymentForm() {
        const paymentHistory = this.editAllocationForm.get('paymentHistory') as FormArray;
        paymentHistory.push(this.getPaymentHistoryForm());
    }

    removePaymentForm(index) {
        const paymentHistory = this.editAllocationForm.get('paymentHistory') as FormArray;
        paymentHistory.removeAt(index);
    }

    getBanks() {
        this.paymentHistory = [...this.data.paymentHistory];

        this.loader.showLoader();
        const uri = environment.banks;
        const token = sessionStorage.getItem('token');

        this.subscription = this.dataService.get(uri, token, '').subscribe(response => {
            this.banks = [...response];
            this.loader.hideLoader();
        });
    }

    get paymentHistoryForms() {
        return (this.editAllocationForm.get('paymentHistory') as FormArray).controls as FormGroup[];
    }

    get formsValid() {
        return this.paymentHistoryForms.every(g => g.valid);
    }
    submit() {
        this.notifications.prompt('Are you sure you want to submit?').then(res => {
            if (res.isConfirmed) {
                this.loader.showLoader();
                const token = sessionStorage.getItem('token');
                const uri = environment.allocations + '/add-payment';
                const body = this.editAllocationForm.value;

                this.subscription = this.dataService.update(uri, this.data._id, body, token).subscribe(response => {
                    this.notifications.alert(`Allocation updated successfully.`).then(result => {
                        this.loader.hideLoader();
                        this.dialogRef.close(true);
                    });
                })
            }
        })
    }
}
