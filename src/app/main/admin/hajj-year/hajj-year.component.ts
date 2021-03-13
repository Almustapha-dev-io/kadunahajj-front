import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';

@Component({
  selector: 'app-hajj-year',
  templateUrl: './hajj-year.component.html',
  styleUrls: ['./hajj-year.component.scss']
})
export class HajjYearComponent implements OnInit, OnDestroy {

  searchText = '';

  currentYear = moment(new Date()).format('YYYY');
  years = [];
  p: number = 1;

  active = 'active';
  display = 'Active Year';

  subscription = new Subscription();
  token = sessionStorage.getItem('token');

  constructor(
    public loader: LoaderService,
    private dataService: DataService,
    private notifications: NotificationService
  ) { }

  ngOnInit(): void {
    this.tabClick('active');
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  tabClick(change: string) {
    let endpoint;
    this.active = change;

    switch(change) {
      case 'active':
        endpoint = 'get-active';
        this.display = 'Active Year';
        break;

      case 'inactive':
        endpoint = 'get-inactive';
        this.display = 'Closed Years';
        break;

      default:
        endpoint = '';
        this.display = 'All Years';
        break;
    }

    this.getYears(endpoint);
  }

  getYears(endpoint) {
    this.loader.showLoader();
    const uri = `${environment.years}/${endpoint}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.years = [...response];
      this.loader.hideLoader();
    });
  }

  closeHajjYear(year) {
    this.notifications.prompt(`Close ${year} hajj ?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.years}/close-hajj-year`;

        this.subscription = this.dataService.update(uri, '', {}, this.token).subscribe(response => {
          this.notifications.successToast(`${response.year} hajj has been successfully closed.`);
          this.tabClick('inactive');
        });
      }
    });
  }

  reopenHajjYear(year) {
    this.notifications.prompt(`Reopen ${year} hajj ?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.years}/reopen-hajj-year`;

        this.subscription = this.dataService.update(uri, '', {}, this.token).subscribe(response => {
          this.notifications.successToast(`${response.year} hajj has been successfully reopened.`);
          this.tabClick('active');
        });
      }
    });
  }

  openNewHajjYear() {
    this.notifications.prompt(`Open ${this.currentYear} hajj ?<br />Note: ALL OPENED HAJJ WILL BE CLOSED.`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.years}/open-new-hajj-year`;

        this.subscription = this.dataService.post(uri, {}, this.token).subscribe(response => {
          this.notifications.successToast(`${response.year} hajj has been successfully opened.`);
          this.tabClick('active');
        });
      }
    });
  }

}
