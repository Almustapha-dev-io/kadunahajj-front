import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { PilgrimDetailsComponent } from './pilgrim-details/pilgrim-details.component';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-pilgrim-list',
  templateUrl: './pilgrim-list.component.html',
  styleUrls: ['./pilgrim-list.component.scss']
})
export class PilgrimListComponent implements OnInit, OnDestroy {

  @ViewChild('yearId') yearId: NgModel;

  searchText = '';
  years = [];

  pilgrims = [];
  p: number = 1;
  pageSize: number = 5;
  pages = [5, 10, 15, 20];
  totalItems: number = 0;

  subscription = new Subscription();
  token = sessionStorage.getItem('token');

  constructor(
    public loader: LoaderService,
    private dataService: DataService,
    private notifications: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getYears();
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

    this.getPilgrims(this.yearId.value, this.pageSize, this.p);
  }

  yearSelected(yearId) {
    this.getPilgrims(yearId);
  }

  getYears() {
    this.loader.showLoader();
    const uri = environment.years + '/all';

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.years = [...response];
      this.loader.hideLoader();
    });
  }

  getPilgrims(yearId, pageSize?, page?) {
    this.loader.showLoader();
    const uri = `${environment.pilgrims}/by-year/${yearId}`;
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
      width: '35rem',
      disableClose: true,
      data: pilgrim
    })
  }
}
