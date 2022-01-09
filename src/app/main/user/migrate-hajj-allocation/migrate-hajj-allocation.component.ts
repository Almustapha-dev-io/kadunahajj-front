import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalLoaderService } from '../../../services/modal-loader.service';
import { DataService } from '../../../services/data.service';
import { environment } from '@environment';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-migrate-hajj-allocation',
    templateUrl: './migrate-hajj-allocation.component.html',
    styleUrls: ['./migrate-hajj-allocation.component.scss']
})
export class MigrateHajjAllocationComponent implements OnInit {
    years: any[] = [];
    seats = [];

    yearId = '';
    zoneId = '';
    allocationNumber = '';
    subscription: Subscription = new Subscription();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataService: DataService,
        public loader: ModalLoaderService,
        private notifications: NotificationService,
        private dialogRef: MatDialogRef<MigrateHajjAllocationComponent>
    ) { }

    ngOnInit(): void {
        console.log(this.data);
        this.years = this.data.years;
        this.zoneId = this.data.allocation.enrollmentZone._id;
    }

    getYearAllocations(yearId) {
        const year = this.years.find(y => y._id === yearId);
        const zoneDetails = year.seatAllocations.find(s => s.zone._id === this.zoneId);
        return zoneDetails ? zoneDetails.seatsAllocated : 0;
    }

    yearSelected() {
        this.loader.showLoader();
        const token = sessionStorage.getItem('token');
        const seatsUri = `${environment.seats}/taken/${this.zoneId}/${this.yearId}`;

        this.subscription = this.dataService
            .get(seatsUri, token)
            .subscribe(response => {
                const takenSeats = new Set(response.map(s => s.seatNumber));
                const allSeats = this.getYearAllocations(this.yearId);
                this.seats.length = 0;

                for (let i = 1; i <= allSeats; i++) {
                    if (!takenSeats.has(i)) {
                        this.seats.push(i);
                    }
                }
                this.loader.hideLoader();
            });
    }

    submit() {
        const req = {
            allocationId: this.data.allocation._id,
            yearId: this.yearId,
            allocationNumber: this.allocationNumber
        };

        this.loader.showLoader();
        const token = sessionStorage.getItem('token');
        const uri = `${environment.allocations}/migrate`;

        this.notifications.prompt('Are you sure you want to migrate this allocation?')
            .then(res => {
                if (res.isConfirmed) {
                    this.subscription = this.dataService
                        .update(uri, '', req, token)
                        .subscribe(response => {
                            this.notifications.alert(`Allocation migrated successfully.
                                <br />Code: <b>${response.allocation.code}</b>`).then(result => {
                                this.loader.hideLoader();
                                this.dialogRef.close(true);
                            });
                        });
                }
            });
    }
}
