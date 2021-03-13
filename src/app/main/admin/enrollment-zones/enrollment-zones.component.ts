import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { EditEnrollmentZoneComponent } from './edit-enrollment-zone/edit-enrollment-zone.component';

@Component({
  selector: 'app-enrollment-zones',
  templateUrl: './enrollment-zones.component.html',
  styleUrls: ['./enrollment-zones.component.scss']
})
export class EnrollmentZonesComponent implements OnInit, OnDestroy {

  searchText = '';

  zones = [];
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
    this.getZones();
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  getZones() {
    this.loader.showLoader();
    const uri = environment.zones;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      const exemptedZones = ['00', '01'];

      this.zones = response.filter(z => !exemptedZones.includes(z.code));
      this.loader.hideLoader();
    });
  }

  editZone(zone) {
    window.scroll(0, 0);
    this.dialog.open(EditEnrollmentZoneComponent, {
      data: zone,
      width: '32rem',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result) this.getZones();
    });
  }
}
