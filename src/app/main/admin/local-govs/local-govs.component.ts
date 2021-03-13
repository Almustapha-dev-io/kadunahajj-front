import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { EditLocalGovComponent } from './edit-local-gov/edit-local-gov.component';

@Component({
  selector: 'app-local-govs',
  templateUrl: './local-govs.component.html',
  styleUrls: ['./local-govs.component.scss']
})
export class LocalGovsComponent implements OnInit, OnDestroy {

  searchText = '';
  stateId = '';

  states = [];
  localGovs = [];

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
    this.getStates();
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  getStates() {
    this.loader.showLoader();
    const uri = `${environment.states}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.states = response.filter(s => s.name !== 'default');
      this.stateId = this.states[0]._id;
      this.getLgas();

      this.loader.hideLoader();
    });
  }

  getLgas() {
    this.loader.showLoader();
    const uri = `${environment.lgas}/by-state`;

    this.subscription = this.dataService.get(uri, this.token, this.stateId).subscribe(response => {
      this.localGovs = [...response];

      this.loader.hideLoader();
    });
  }

  editLga(lga) {
    window.scroll(0, 0);
    this.dialog.open(EditLocalGovComponent, {
      data: lga,
      width: '32rem',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result) this.getLgas();
    });
  }

}
