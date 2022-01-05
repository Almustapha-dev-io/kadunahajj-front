import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { PilgrimDetailsComponent } from '../pilgrim-list/pilgrim-details/pilgrim-details.component';
import { EditPilgrimComponent } from '../pilgrim-list/edit-pilgrim/edit-pilgrim.component';
import { NotificationService } from 'src/app/services/notification.service';
import { PilgrimDeleteComponent } from '../pilgrim-delete/pilgrim-delete.component';
import { PilgrimMigrateComponent } from '../pilgrim-migrate/pilgrim-migrate.component';

@Component({
  selector: 'app-pilgrim-reviewer-list',
  templateUrl: './pilgrim-reviewer-list.component.html',
  styleUrls: ['./pilgrim-reviewer-list.component.scss']
})
export class PilgrimReviewerListComponent implements OnInit, OnDestroy {

  @ViewChild('yearId') year: HTMLInputElement;
  @ViewChild('zoneId') zone: HTMLInputElement;

  searchText = '';
  years = [];
  zones = [];
  banks = [];
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
    private dialog: MatDialog,
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

    this.fetchPilgrims(this.year.value, this.zone.value, this.pageSize, this.p);
  }

  fetchPilgrims(yearId, zoneId, pageSize?, page?) {
    this.loader.showLoader();
    const uri = `${environment.pilgrims}/reviewer/by-year-and-lga/${zoneId}/${yearId}`;
    const params = { pageSize, page };

    this.subscription = this.dataService.get(uri, this.token, null, params).subscribe(response => {
      this.pilgrims = [...response.pilgrims];
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

      this.pilgrims.forEach(p => {
        p.paymentHistory.forEach(ph => {
          ph.bankObject = this.banks.find(b => b._id === ph.bank)
        })
      });

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
    pilgrim.isReviewer = true;
    this.dialog.open(EditPilgrimComponent, {
      width: '45rem',
      disableClose: true,
      data: pilgrim
    }).afterClosed().subscribe(r => r ? this.fetchPilgrims(this.year.value, this.zone.value, this.pageSize, this.p) : '');
  }

  deletePilgrim(pilgrim) {
    window.scroll(0, 0);
    this.dialog.open(PilgrimDeleteComponent, {
      width: '450px',
      disableClose: true,
      data: pilgrim
    }).afterClosed().subscribe(r => r ? this.fetchPilgrims(this.year.value, this.zone.value, this.pageSize, this.p) : '');
  }

  migratePilgrim(pilgrim) {
    window.scroll(0, 0);
    this.dialog.open(PilgrimMigrateComponent, {
      width: '25rem',
      disableClose: true,
      data: { pilgrim, years: this.years.filter(y => {
          console.log({ y: y._id, s: this.year.value});
          return y._id !== this.year.value;
      }) }
    }).afterClosed().subscribe(r => r ? this.fetchPilgrims(this.year.value, this.zone.value, this.pageSize, this.p) : '');
}

  exportToExcel() {
    const filename = 'ExcelSheet.xlsx';
    let element = document.getElementById('excel-table');

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    XLSX.writeFile(wb, filename);
  }
}
