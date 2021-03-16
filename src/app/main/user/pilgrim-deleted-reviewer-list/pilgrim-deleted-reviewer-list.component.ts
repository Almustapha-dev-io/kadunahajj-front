import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';
import { PilgrimDetailsComponent } from '../pilgrim-list/pilgrim-details/pilgrim-details.component';

@Component({
  selector: 'app-pilgrim-deleted-reviewer-list',
  templateUrl: './pilgrim-deleted-reviewer-list.component.html',
  styleUrls: ['./pilgrim-deleted-reviewer-list.component.scss']
})
export class PilgrimDeletedReviewerListComponent implements OnInit, OnDestroy {

  searchText = '';
  years = [];
  zones = [];
  banks = [];
  pilgrims = [];
  p: number = 1;

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
    const yearsUri = environment.years;
    const zoneUri = environment.zones;

    this.subscription = forkJoin([this.dataService.get(yearsUri, this.token), this.dataService.get(zoneUri, this.token)])
      .subscribe(response => {
        this.years = [...response[0]];
        const exemptedZones = ['00', '01'];

        this.zones = response[1].filter(z => !exemptedZones.includes(z.code));
        this.loader.hideLoader();
      });
  }

  fetchPilgrims(yearId, zoneId) {
    this.loader.showLoader();
    const uri = `${environment.pilgrims}/reviewer/deleted-by-year-and-lga/${zoneId}/${yearId}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.pilgrims = [...response];
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
      width: '35rem',
      disableClose: true,
      data: pilgrim
    });
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
