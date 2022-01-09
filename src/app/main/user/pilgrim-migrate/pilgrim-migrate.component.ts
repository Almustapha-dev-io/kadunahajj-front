import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ModalLoaderService } from '../../../services/modal-loader.service';
import { DataService } from '../../../services/data.service';
import { environment } from '@environment';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pilgrim-migrate',
    templateUrl: './pilgrim-migrate.component.html',
    styleUrls: ['./pilgrim-migrate.component.scss']
})
export class PilgrimMigrateComponent implements OnInit {
    years: any[] = [];
    seats = [];

    lgaId = '';
    yearId = '';
    pilgrimId = '';
    allocationNumber = '';
    subscription: Subscription = new Subscription();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataService: DataService,
        public loader: ModalLoaderService,
        private notifications: NotificationService,
        private dialogRef: MatDialogRef<PilgrimMigrateComponent>
    ) { }

    ngOnInit(): void {
        this.lgaId = this.data.pilgrim.enrollmentDetails.enrollmentZone._id;
        this.pilgrimId = this.data.pilgrim._id;
        this.years = this.data.years;
    }

    getYearAllocations(yearId) {
        const year = this.years.find(y => y._id === yearId);
        const zoneDetails = year.seatAllocations.find(s => s.zone._id === this.lgaId);
        return zoneDetails ? zoneDetails.seatsAllocated : 0;
    }

    submit() {
        const req = {
            pilgrimId: this.pilgrimId,
            yearId: this.yearId,
            allocationNumber: this.allocationNumber
        };

        this.loader.showLoader();
        const token = sessionStorage.getItem('token');
        const uri = `${environment.pilgrims}/migrate`;

        this.notifications.prompt('Are you sure you want to migrate this pilgrim?')
            .then(res => {
                if (res.isConfirmed) {
                    this.subscription = this.dataService
                        .update(uri, '', req, token)
                        .subscribe(response => {
                            this.notifications.alert(`Pilgrim migrated successfully.
                                <br />Code: <b>${response.enrollmentDetails.code}</b>`).then(result => {
                                this.loader.hideLoader();
                                this.dialogRef.close(true);
                            });
                        });
                }
            });
    }

    yearSelected() {
        this.loader.showLoader();
        const token = sessionStorage.getItem('token');
        const seatsUri = `${environment.seats}/taken/${this.lgaId}/${this.yearId}`;

        this.subscription = this.dataService
            .get(seatsUri, token)
            .subscribe(response => {
                console.log({ response });
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
}
