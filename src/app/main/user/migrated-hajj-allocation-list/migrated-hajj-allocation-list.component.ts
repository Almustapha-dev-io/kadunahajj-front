import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';

import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { ViewHajjAllocationComponent } from '../view-hajj-allocation/view-hajj-allocation.component';

@Component({
    selector: 'app-migrated-hajj-allocation-list',
    templateUrl: './migrated-hajj-allocation-list.component.html',
    styleUrls: ['./migrated-hajj-allocation-list.component.scss']
})
export class MigratedHajjAllocationListComponent implements OnInit {
    @ViewChild('yearId') year: HTMLInputElement;
    @ViewChild('zoneId') zone: HTMLInputElement;

    searchText = '';
    years = [];
    zones = [];
    banks = [];
    allocations = [];
    p = 1;
    pageSize = 5;
    pages = [5, 10, 15, 20];
    totalItems = 0;
    subscription = new Subscription();
    token = sessionStorage.getItem('token');

    constructor(
        public loader: LoaderService,
        private dataService: DataService,
        private dialog: MatDialog
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
    
    onPageSizeChange() {
        this.onNavigate(1);
    }

    onNavigate(p?) {
        if (p) {
            this.p = p;
        }

        this.fetchAllocations(this.year.value, this.zone.value, this.pageSize, this.p);
    }


    fetchAllocations(yearId, zoneId, pageSize?, page?) {
        this.loader.showLoader();
        const uri = `${environment.allocations}/zone/${zoneId}/year/${yearId}/migrated`;
        const params = { pageSize, page };

        this.subscription = this.dataService.get(uri, this.token, null, params).subscribe(response => {
            this.allocations = [...response.allocations];
            this.totalItems = response.totalDocs;
            this.getBanks();
            this.loader.hideLoader();
        });
    }

    getBanks() {
        this.loader.showLoader();
        const uri = environment.banks;
        const token = sessionStorage.getItem('token');

        this.subscription = this.dataService.get(uri, token, '').subscribe(response => {
            this.banks = [...response];

            this.allocations.forEach(p => {
                p.paymentHistory.forEach(ph => {
                    ph.bankObject = this.banks.find(b => b._id === ph.bank);
                });
            });

            this.loader.hideLoader();
        });
    }

    viewAllocation(a) {
        window.scroll(0, 0);
        this.dialog.open(ViewHajjAllocationComponent, {
            width: '45rem',
            disableClose: true,
            data: a
        });
    }
}
