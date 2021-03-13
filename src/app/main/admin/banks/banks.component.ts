import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { EditBankComponent } from './edit-bank/edit-bank.component';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit, OnDestroy {

  searchText = '';

  banks = [];
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
    this.getBanks();
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }


  getBanks() {
    this.loader.showLoader();
    const uri = `${environment.banks}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.banks = [...response];

      this.loader.hideLoader();
    });
  }

  editBank(bank?) {
    window.scroll(0, 0);
    this.dialog.open(EditBankComponent, {
      data: bank? bank: null,
      width: '32rem',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result) this.getBanks();
    });
  }

}
