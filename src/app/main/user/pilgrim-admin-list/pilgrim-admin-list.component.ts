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
import { RestorePilgrimComponent } from './restore-pilgrim/restore-pilgrim.component';

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

  tabClick(change: string) {
    this.p = 1;
    this.pageSize = 5;
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
    this.yearSelected(this.yearId.value);
  }

  onPageSizeChange() {
    this.onNavigate(1);
  }

  onNavigate(p?) {
    if (p) {
      this.p = p;
    }

    if (this.active === 'deleted') {
      this.getPilgrims(this.yearId.value, true, this.pageSize, this.p);
      return;
    }

    this.getPilgrims(this.yearId.value, false, this.pageSize, this.p);
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
    const uri = environment.years + '/all';

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.years = [...response];
      this.yearId.reset(this.years[0]._id);
      this.yearSelected(this.years[0]._id);
    });
  }

  getPilgrims(yearId, deleted?, pageSize?, page?) {
    this.loader.showLoader();

    const params = { pageSize, page };
    let uri = `${environment.pilgrims}/by-year/${yearId}`;
    if (deleted) {
      uri = `${environment.pilgrims}/deleted-by-year/${yearId}`;
    }

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
      width: '35rem',
      disableClose: true,
      data: pilgrim
    });
  }

  deletePilgrim(pilgrim) {
    this.notifications.prompt(`Are you sure you <br /> want to delete <br />${pilgrim.enrollmentDetails.code} ?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = environment.pilgrims;
        this.subscription = this.dataService.delete(uri, pilgrim._id, this.token).subscribe((response: any) => {
          this.notifications.successToast(`Pilgrim was deleted successfully.`);
          this.yearSelected(this.yearId.value);
          this.active = 'deleted';
          this.display = 'Deleted Pilgrims';
          this.getPilgrims(this.yearId.value, true);
        });
      }
    });
  }

  restorePilgrim(pilgrim) {
    window.scroll(0, 0);
    this.dialog.open(RestorePilgrimComponent, {
      width: '20rem',
      disableClose: true,
      data: pilgrim
    }).afterClosed().subscribe(result => {
      if (result) {
        this.yearSelected(this.yearId.value);
        this.active = 'active';
        this.display = 'Active Pilgrims';
        this.getPilgrims(this.yearId.value);
      }
    });
  }


  editPilgrim(pilgrim) {
    window.scroll(0, 0);
    this.dialog.open(EditPilgrimComponent, {
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
