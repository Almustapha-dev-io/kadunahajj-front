import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';
import { environment } from '@environment';

@Component({
    selector: 'app-pilgrim-export',
    templateUrl: './pilgrim-export.component.html',
    styleUrls: ['./pilgrim-export.component.scss']
})
export class PilgrimExportComponent implements OnInit {
    subscription = new Subscription();
    token = sessionStorage.getItem('token');

    constructor(
        public loader: LoaderService,
        private dataService: DataService,
        private notifications: NotificationService,
    ) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.loader.hideLoader();
        this.subscription.unsubscribe();
    }

    get url() {
        return environment.exports + '/pilgrims';
    }
}
