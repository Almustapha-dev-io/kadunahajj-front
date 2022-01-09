import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '@environment';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

@Component({
    selector: 'app-allocation-export',
    templateUrl: './allocation-export.component.html',
    styleUrls: ['./allocation-export.component.scss']
})
export class AllocationExportComponent implements OnInit, OnDestroy {
    year = '';
    years = [];
    type = 'active';
    types = ['active', 'deleted', 'migrated'];
    subscription = new Subscription();
    zone = sessionStorage.getItem('localGov');
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

        this.subscription = this.dataService.get(yearsUri, this.token).subscribe(response => {
            this.years = [...response];
            this.loader.hideLoader();
        });
    }

    get url() {
        const q = `?yearId=${this.year}&zoneId=${this.zone}`;
        return environment.exports + '/allocations/' + this.type + q;
    }

}
