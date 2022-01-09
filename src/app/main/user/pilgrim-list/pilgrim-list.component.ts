import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { PilgrimDetailsComponent } from './pilgrim-details/pilgrim-details.component';
import { EditPilgrimComponent } from './edit-pilgrim/edit-pilgrim.component';

@Component({
    selector: 'app-pilgrim-list',
    templateUrl: './pilgrim-list.component.html',
    styleUrls: ['./pilgrim-list.component.scss']
})
export class PilgrimListComponent implements OnInit, OnDestroy {
    searchText = '';

    pilgrims = [];
    p = 1;
    pageSize = 5;
    pages = [5, 10, 15, 20];
    totalItems = 0;

    subscription = new Subscription();
    token = sessionStorage.getItem('token');

    constructor(
        public loader: LoaderService,
        private dataService: DataService,
        private notifications: NotificationService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getPilgrims();
    }

    ngOnDestroy(): void {
        this.loader.hideLoader();
        this.subscription.unsubscribe();
    }

    onPageSizeChange() {
        this.onNavigate(1);
    }

    onNavigate(p?) {
        if (p) {
            this.p = p;
        }

        this.getPilgrims(this.pageSize, this.p);
    }

    getPilgrims(pageSize?, page?) {
        this.loader.showLoader();
        const uri = `${environment.pilgrims}`;
        const params = { pageSize, page };

        this.subscription = this.dataService.get(uri, this.token, null, params).subscribe(response => {
            this.pilgrims = [...response.pilgrims];
            this.totalItems = response.totalDocs;
            this.loader.hideLoader();
        });
    }

    viewPilgrim(pilgrim) {
        window.scroll(0, 0);
        this.dialog.open(PilgrimDetailsComponent, {
            width: '45rem',
            disableClose: true,
            data: pilgrim
        });
    }

    editPilgrim(pilgrim) {
        window.scroll(0, 0);
        this.dialog.open(EditPilgrimComponent, {
            width: '45rem',
            disableClose: true,
            data: pilgrim
        }).afterClosed().subscribe(r => r ? this.getPilgrims(this.pageSize, this.p) : '');
    }
}
