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
  active = 'active';
  display = 'Active Banks';

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

  tabClick(change: string) {
    this.p = 1;

    let inactive;
    this.active = change;

    switch(change) {
      case 'active':
        inactive = false;
        this.display = 'Active Banks';
        break;

      case 'inactive':
        inactive = true;
        this.display = 'Inactive Banks';
        break;
    }

    this.getBanks(inactive);
  }


  getBanks(inactive?: boolean) {
    this.loader.showLoader();

    let uri = `${environment.banks}`;
    if (inactive) {
      uri = `${environment.banks}/inactive`;
    }

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.banks = [...response];
      this.loader.hideLoader();
    });
  }

  deactivateBank(bank) {
    this.notifications.prompt(`Are you sure you want to deactivate ${bank.name}?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const uri = `${environment.banks}/deactivate`;

        this.subscription = this.dataService.update(uri, bank._id, {}, this.token).subscribe(response => {
          this.notifications.successToast(`Bank successfully deactivated.`);
          console.log(response);
          this.tabClick('active');
        });
      }
    });
  }

  activateBank(bank) {
   this.notifications.prompt(`Are you sure you want to activate ${bank.name}?`).then(result => {
    if (result.isConfirmed) {
      this.loader.showLoader();
      const uri = `${environment.banks}/activate`;

      this.subscription = this.dataService.update(uri, bank._id, {}, this.token).subscribe(response => {
        this.notifications.successToast(`Bank successfully activated.`);

        this.tabClick('inactive')
      });
    }
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
