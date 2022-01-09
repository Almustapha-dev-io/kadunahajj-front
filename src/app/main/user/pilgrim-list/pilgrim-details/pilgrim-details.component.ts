import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

import { ModalLoaderService } from '../../../../services/modal-loader.service';

@Component({
  selector: 'app-pilgrim-details',
  templateUrl: './pilgrim-details.component.html',
  styleUrls: ['./pilgrim-details.component.scss']
})
export class PilgrimDetailsComponent implements OnInit, OnDestroy {
  personalDetails;
  officeDetails;
  nextOfKinDetails;
  passportDetails;
  attachedDocuments;
  subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public loader: ModalLoaderService
  ) { }

  ngOnInit(): void {
    this.personalDetails = { ...this.data.personalDetails };
    this.officeDetails = { ...this.data.officeDetails };
    this.nextOfKinDetails = { ...this.data.nextOfKinDetails };
    this.passportDetails = { ...this.data.passportDetails };
    this.attachedDocuments = { ...this.data.attachedDocuments };
    window.scroll(0, 0);
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  imageFile(name) {
    window.scroll(0,0);
    return `${environment.pilgrims}/image/${name}`;
  }
}
