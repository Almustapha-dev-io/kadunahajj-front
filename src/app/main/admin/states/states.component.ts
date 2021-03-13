import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { EditStateComponent } from './edit-state/edit-state.component';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit, OnDestroy {

  searchText = '';

  states = [];
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

      this.loader.hideLoader();
    });
  }


  editState(state) {
    window.scroll(0, 0);
    this.dialog.open(EditStateComponent, {
      data: state,
      width: '32rem',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result) this.getStates();
    });
  }

}
