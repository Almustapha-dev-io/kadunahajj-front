import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { NgModel } from '@angular/forms';
import * as XLSX from 'xlsx';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { PilgrimDetailsComponent } from '../pilgrim-list/pilgrim-details/pilgrim-details.component';
import { EditPilgrimComponent } from './edit-pilgrim/edit-pilgrim.component';

@Component({
  selector: 'app-pilgrim-admin-list',
  templateUrl: './pilgrim-admin-list.component.html',
  styleUrls: ['./pilgrim-admin-list.component.scss']
})
export class PilgrimAdminListComponent implements OnInit, OnDestroy {

  @ViewChild('yearId') yearId: NgModel;

  active = 'active';
  display = 'Active Pilgrims';

  searchText = '';
  years = [];
  banks = [];
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

  tabClick(change: string) {
    this.active = change;

    switch(change) {
      case 'active':
        this.display = 'Active Pilgrims';
        break;

      case 'deleted':
        this.display = 'Deleted Pilgrims';
        break;
    }

    this.pilgrims = [];
    this.yearId.reset(this.years[0]._id);
    this.yearSelected(this.years[0]._id);
  }

  yearSelected(yearId) {
    if (this.active === 'deleted') {
      this.getPilgrims(yearId, true);
      return;
    }

    this.getPilgrims(yearId);
  }

  getYears() {
    this.loader.showLoader();
    const uri = environment.years;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.years = [...response];
      this.yearId.reset(this.years[0]._id);
      this.yearSelected(this.years[0]._id);
    });
  }

  getPilgrims(yearId, deleted?) {
    this.loader.showLoader();

    let uri = `${environment.pilgrims}/by-year/${yearId}`;
    if (deleted) uri = `${environment.pilgrims}/deleted-by-year/${yearId}`;

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

  deletePilgrim(pilgrim) {
    this.notifications.prompt(`Are you sure you <br /> want to delete <br />${pilgrim.enrollmentDetails.code} ?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.pilgrims}/delete`;
        console.log(this);
        this.subscription = this.dataService.update(uri, pilgrim._id, {}, this.token).subscribe(response => {
          this.notifications.successToast(`Pilgrim ${response.enrollmentDetails.code} was deleted successfully.`);

          this.tabClick('active');
        });
      }
    })
  }

  restorePilgrim(pilgrim) {
    this.notifications.prompt(`Are you sure you <br />want to restore <br /> ${pilgrim.enrollmentDetails.code} ?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.pilgrims}/restore`;
        console.log(this);
        this.subscription = this.dataService.update(uri, pilgrim._id, {}, this.token).subscribe(response => {
          this.notifications.successToast(`Pilgrim ${response.enrollmentDetails.code} was restored successfully.`);

          this.tabClick('deleted');
        });
      }
    })
  }

  editPilgrim(pilgrim) {
    window.scroll(0, 0);
    this.dialog.open(EditPilgrimComponent, {
      width: '35rem',
      disableClose: true,
      data: pilgrim
    })
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
