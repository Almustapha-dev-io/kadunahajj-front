import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

import { ModalLoaderService } from '../../../services/modal-loader.service';
import { DataService } from '../../../services/data.service';

@Component({
    selector: 'app-view-hajj-allocation',
    templateUrl: './view-hajj-allocation.component.html',
    styleUrls: ['./view-hajj-allocation.component.scss']
})
export class ViewHajjAllocationComponent implements OnInit {
    banks = [];
    subscription = new Subscription();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataService: DataService,
        public loader: ModalLoaderService
    ) { }

    ngOnInit(): void {
        console.log(this.data);
        window.scroll(0, 0);
        this.getBanks();
    }

    ngOnDestroy(): void {
        this.loader.hideLoader();
        this.subscription.unsubscribe();
    }

    getBanks() {
        this.loader.showLoader();
        const uri = environment.banks;
        const token = sessionStorage.getItem('token');

        this.subscription = this.dataService.get(uri, token, '').subscribe(response => {
            this.banks = [...response];

            this.data.paymentHistory.forEach(p => {
                p.bankObject = this.banks.find(b => b._id === p.bank);
            });

            this.loader.hideLoader();
        });
    }
}
