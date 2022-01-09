import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Subscription } from 'rxjs';

import { ModalLoaderService } from '../../../services/modal-loader.service';
import { DataService } from '../../../services/data.service';
import { environment } from '@environment';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { FormsService } from 'src/app/services/forms.service';
import { YearValidators } from 'src/app/common/Validators/year.vaalidators';

@Component({
    selector: 'app-add-hajj-allocation',
    templateUrl: './add-hajj-allocation.component.html',
    styleUrls: ['./add-hajj-allocation.component.scss']
})
export class AddHajjAllocationComponent implements OnInit {
    years: any[] = [];
    zone: any;
    zones = [];
    seats: any[] = [];
    banks = [];
    allocationForm: FormGroup;
    subscription: Subscription = new Subscription();
    token = sessionStorage.getItem('token');
    userLga = sessionStorage.getItem('localGov');
    lgLoader = false;
    showLga = false;
    hajjExperienceShown = false;
    selectLoader = false;
    pilgrims: any[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataService: DataService,
        private formsService: FormsService,
        public loader: ModalLoaderService,
        private notifications: NotificationService,
        private dialogRef: MatDialogRef<AddHajjAllocationComponent>
    ) { }

    ngOnInit(): void {
        this.years = [...this.data.years];
        this.allocationForm = this.formsService.allocationForm;
        this.fetchOptions();
        // if (this.allocationForm.value) {
        //     this.showLga = true;
        //     this.seats = [...JSON.parse(sessionStorage.getItem('seatsArray'))];
        // }
    }

    fetchOptions() {
        this.loader.showLoader();
        const token = sessionStorage.getItem('token');
        const zonesUri = `${environment.zones}`;
        const banksUri = environment.banks;

        this.subscription = forkJoin([
            this.dataService.get(zonesUri, token, this.userLga),
            this.dataService.get(banksUri, this.token, '')
        ]).subscribe(response => {
            this.zone = response[0];
            this.banks = response[1];
            this.zones.push(this.zone);
            this.allocationForm.patchValue({
                enrollmentZone: this.zone._id
            });
            this.loader.hideLoader();
        });
    }


    getYearAllocations(yearId) {
        const year = this.years.find(y => y._id === yearId);
        const zoneDetails = year.seatAllocations.find(s => s.zone._id === this.zone._id);
        return zoneDetails ? zoneDetails.seatsAllocated : 0;
    }

    yearSelected() {
        this.enrollmentAllocationNumber.reset('');

        this.lgLoader = true;
        const token = sessionStorage.getItem('token');
        const seatsUri = `${environment.seats}/taken/${this.zone._id}/${this.enrollmentYear.value}`;

        this.subscription = this.dataService
            .get(seatsUri, token)
            .subscribe(response => {
                const takenSeats = new Set(response.map(s => s.seatNumber));
                const allSeats = this.getYearAllocations(this.enrollmentYear.value);
                this.seats.length = 0;

                for (let i = 1; i <= allSeats; i++) {
                    if (!takenSeats.has(i)) {
                        this.seats.push(i);
                    }
                }

                this.lgLoader = false;
                this.showLga = true;
            });
    }

    toggleHajjExperience() {
        if (this.lastHajjYear.valid) {
            if (this.lastHajjYear.value === '0000') {
                this.hajjExperienceShown = false;
                this.hajjExperience.patchValue('Inexperienced');
            } else {
                this.hajjExperienceShown = true;
            }
        } else {
            this.hajjExperienceShown = false;
        }
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
        }
    }

    removeFormGroup(index) {
        this.paymentHistory.controls.splice(index, 1);
    }

    submit() {
        this.notifications.prompt('Are you sure you want to submit?').then(result => {
            if (result.isConfirmed) {
                this.loader.showLoader();
                const token = sessionStorage.getItem('token');
                const uri = environment.allocations;

                this.subscription = this.dataService.post(uri, this.allocationForm.value, token).subscribe(response => {
                    this.notifications.alert(`Allocation added successfully. <br/> <b>Code: ${response.allocation.code}</b>`).then(_ => {
                        this.allocationForm.reset();
                        this.loader.hideLoader();
                        this.dialogRef.close(true)
                    });
                });
            }
        });
    }


    getPilgrims(data): void {
        const term = data.term;
        if (!term) { return; }
        if (term.length === 0) { return; }

        this.selectLoader = true;
        const uri = `${environment.pilgrims}/filter/all?term=${term}`;
        this.dataService.get(uri, this.token).subscribe(response => {
            console.log(response);
            this.pilgrims = response;
            this.selectLoader = false;
        });
    }

    get pilgrim() {
        return this.allocationForm.get('pilgrim') as FormControl;
    }

    get hajjExperience() {
        return this.allocationForm.get('hajjExperience') as FormControl;
    }

    get lastHajjYear() {
        return this.allocationForm.get('lastHajjYear') as FormControl;
    }

    get enrollmentZone() {
        return this.allocationForm.get('enrollmentZone') as FormControl;
    }

    get enrollmentYear() {
        return this.allocationForm.get('enrollmentYear') as FormControl;
    }

    get enrollmentAllocationNumber() {
        return this.allocationForm.get('enrollmentAllocationNumber') as FormControl;
    }

    get paymentHistory() {
        return this.allocationForm.get('paymentHistory') as FormArray;
    }
}
