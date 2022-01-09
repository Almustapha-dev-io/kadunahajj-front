import { environment } from '@environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
    selector: 'app-initiator',
    templateUrl: './initiator.component.html',
    styleUrls: ['./initiator.component.scss']
})
export class InitiatorComponent implements OnInit, OnDestroy {

    token = sessionStorage.getItem('token');
    yearId;
    localGov = sessionStorage.getItem('localGov');
    subscription = new Subscription();
    totalThisYear = 0;
    overAllTotal = 0;
    total = 0;
    overAllTotalComplete = false;
    totalThisYearComplete = false;

    constructor(
        public loader: LoaderService,
        private dataService: DataService
    ) { }

    ngOnInit(): void {
        this.loader.showLoader();
        this.getCurrentYearCount();
        this.getTotalCount();
        this.getAllPilgrimsCount();

        const interval = setInterval(() => {
            if (this.totalThisYearComplete && this.overAllTotalComplete) {
                this.loader.hideLoader();

                clearInterval(interval);
            }
        }, 100);
    }

    ngOnDestroy(): void {
        this.loader.hideLoader();
        this.subscription.unsubscribe();
    }

    getTotalCount(): void {
        const uri = `${environment.analytics}/lga-allocations-count/${this.localGov}`;
        this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
            this.total = response.count;
        });
    }

    getCurrentYearCount(): void {
        const uri = `${environment.years}/by-year/${new Date().getFullYear()}`;

        this.subscription = this.dataService.get(uri, this.token).subscribe(year => {
            this.getCurrentYearCountHelper(year._id);
        });
    }

    getCurrentYearCountHelper(yearId): void {
        const uri = `${environment.analytics}/lga-allocations-count/${this.localGov}/${yearId}`;

        this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
            this.totalThisYear = response.count;
            this.totalThisYearComplete = true;
        });
    }

    getAllPilgrimsCount(): void {
        const uri = `${environment.analytics}/all-pilgrims`;

        this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
            this.overAllTotal = response.count;
            this.overAllTotalComplete = true;
        });
    }
}

