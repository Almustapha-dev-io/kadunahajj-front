import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { PilgrimDetailsComponent } from './pilgrim-details/pilgrim-details.component';

@Component({
  selector: 'app-pilgrim-list',
  templateUrl: './pilgrim-list.component.html',
  styleUrls: ['./pilgrim-list.component.scss']
})
export class PilgrimListComponent implements OnInit, OnDestroy {

  searchText = '';
  years = [];

  pilgrims = [];
  p: number = 1;

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

  yearSelected(yearId) {
    this.getPilgrims(yearId);
  }

  getYears() {
    this.loader.showLoader();
    const uri = environment.years;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.years = [...response];
      this.loader.hideLoader();
    });
  }

  getPilgrims(yearId) {
    this.loader.showLoader();
    const uri = `${environment.pilgrims}/by-year/${yearId}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.pilgrims = [...response];
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
