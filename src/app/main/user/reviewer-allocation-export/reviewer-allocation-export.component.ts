import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { environment } from '@environment';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

@Component({
    selector: 'app-reviewer-allocation-export',
    templateUrl: './reviewer-allocation-export.component.html',
    styleUrls: ['./reviewer-allocation-export.component.scss']
})
export class ReviewerAllocationExportComponent implements OnInit, OnDestroy {
    zones = [];
    years = [];

    year = '';
    zone = '';
    type = 'active';
    types = ['active', 'deleted', 'migrated'];
    subscription = new Subscription();
    token = sessionStorage.getItem('token');

    constructor(
        public loader: LoaderService,
        private dataService: DataService,
    ) { }

    ngOnInit(): void {
        this.fetchData();
    }

    ngOnDestroy(): void {
        this.loader.hideLoader();
        this.subscription.unsubscribe();
    }

    fetchData() {
        this.loader.showLoader();
        const yearsUri = `${environment.years}/all`;
        const zoneUri = environment.zones;

        this.subscription = forkJoin([this.dataService.get(yearsUri, this.token), this.dataService.get(zoneUri, this.token)])
            .subscribe(response => {
                this.years = [...response[0]];
                const exemptedZones = ['00', '01'];

                this.zones = response[1].filter(z => !exemptedZones.includes(z.code));
                this.loader.hideLoader();
            });
    }

    get url() {
        const q = `?yearId=${this.year}&zoneId=${this.zone}`;
        return environment.exports + '/allocations/' + this.type + q;
    }
}
