import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

import { DataService } from '../../../../services/data.service';
import { ModalLoaderService } from '../../../../services/modal-loader.service';

@Component({
  selector: 'app-view-update-history',
  templateUrl: './view-update-history.component.html',
  styleUrls: ['./view-update-history.component.scss']
})
export class ViewUpdateHistoryComponent implements OnInit {
  token = sessionStorage.getItem('token');
  subscription: Subscription = new Subscription();
  history = [];
  searchText = '';
  p = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public loader: ModalLoaderService,
    private dataService: DataService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewUpdateHistoryComponent>
  ) { }

  ngOnInit(): void {
    this.getHistory();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loader.hideLoader();
  }

  getHistory() {
    this.loader.showLoader();
    const uri = environment.years + '/updates';

    this.subscription = this.dataService.get(uri, this.token, this.data).subscribe(response => {
      this.history = response;
      this.loader.hideLoader();
    });
  }
}
