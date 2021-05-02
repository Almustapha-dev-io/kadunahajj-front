import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-pilgrim-details',
  templateUrl: './pilgrim-details.component.html',
  styleUrls: ['./pilgrim-details.component.scss']
})
export class PilgrimDetailsComponent implements OnInit, OnDestroy {

  enrollmentDetails;
  personalDetails;
  officeDetails;
  nextOfKinDetails;
  passportDetails;
  paymentHistory = [];
  attachedDocuments;

  banks = [];
  subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    public loader: ModalLoaderService
  ) { }

  ngOnInit(): void {
    this.enrollmentDetails = { ...this.data.enrollmentDetails };
    this.personalDetails = { ...this.data.personalDetails };
    this.officeDetails = { ...this.data.officeDetails };
    this.nextOfKinDetails = { ...this.data.nextOfKinDetails };
    this.passportDetails = { ...this.data.passportDetails };
    this.getBanks();
    this.attachedDocuments = { ...this.data.attachedDocuments };
    window.scroll(0, 0);
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  getBanks() {
    this.paymentHistory = [...this.data.paymentHistory];

    this.loader.showLoader();
    const uri = environment.banks;
    const token = sessionStorage.getItem('token');

    this.subscription = this.dataService.get(uri, token, '').subscribe(response => {
      this.banks = [...response];

      this.paymentHistory.forEach(p => {
        p.bankObject = this.banks.find(b => b._id === p.bank)
      });

      this.loader.hideLoader();
    });
  }


  imageFile(name) {
    window.scroll(0,0);
    return `${environment.pilgrims}/image/${name}`;
  }
}
