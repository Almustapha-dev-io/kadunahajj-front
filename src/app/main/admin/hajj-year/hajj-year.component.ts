import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { NewHajjYearComponent } from './new-hajj-year/new-hajj-year.component';
import { ViewHajjYearComponent } from './view-hajj-year/view-hajj-year.component';

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
  pageSize: number = 5;
  pages = [5, 10, 15, 20];
  totalItems: number = 0;

  active = 'active';
  display = 'Active Year';

  subscription = new Subscription();
  token = sessionStorage.getItem('token');

  constructor(
    public loader: LoaderService,
    private dataService: DataService,
    private notifications: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tabClick('active');
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  tabClick(change: string) {
    this.p = 1;
    this.pageSize = 5;

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

  onPageSizeChange() {
    this.onNavigate(1);
  }

  onNavigate(p?) {
    if (p) {
      this.p = p;
    }

    let endpoint;

    switch(this.active) {
      case 'active':
        endpoint = 'get-active';
        break;

      case 'inactive':
        endpoint = 'get-inactive';
        break;

      default:
        endpoint = '';
        break;
    }

    this.getYears(endpoint, this.pageSize, this.p);
  }

  getYears(endpoint, pageSize?, page?) {
    this.loader.showLoader();
    const uri = `${environment.years}/${endpoint}`;
    const params = { pageSize, page };

    this.subscription = this.dataService.get(uri, this.token, null, params).subscribe(response => {
      this.years = [...response.years];
      this.totalItems = response.totalDocs;

      this.loader.hideLoader();
    });
  }

  closeHajjYear(year) {
    this.notifications.prompt(`Close ${year.year} hajj ?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.years}/close-hajj-year/${year._id}`;

        this.subscription = this.dataService.update(uri, '', {}, this.token).subscribe(response => {
          this.notifications.successToast(`${response.year} hajj has been successfully closed.`);
          this.tabClick('inactive');
        });
      }
    });
  }

  reopenHajjYear(year) {
    this.notifications.prompt(`Reopen ${year.year} hajj ?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.years}/reopen-hajj-year/${year._id}`;

        this.subscription = this.dataService.update(uri, '', {}, this.token).subscribe(response => {
          this.notifications.successToast(`${response.year} hajj has been successfully reopened.`);
          this.tabClick('active');
        });
      }
    });
  }

  openNewHajjYear() {
    window.scroll(0, 0);
    this.dialog.open(NewHajjYearComponent, {
      width: '42rem',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result) {
        this.tabClick(this.active);
      }
    });
  }

  viewHajjYear(year) {
    this.loader.showLoader();
    const uri = `${environment.years}/${year._id}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.loader.hideLoader();
      window.scroll(0, 0);
      this.dialog.open(ViewHajjYearComponent, {
        width: '50rem',
        data: response,
        disableClose: true
      }).afterClosed().subscribe(result => {
        if (result) {
          this.tabClick(this.active);
        }
      });
    });
  }

}
