import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';
import { ModalLoaderService } from '../../services/modal-loader.service';

import { environment } from '@environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  token = sessionStorage.getItem('token');
  userId = sessionStorage.getItem('userId');
  user;

  constructor(
    public loader: ModalLoaderService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  getUser() {
    this.loader.showLoader();

    let uri = environment.users;

    this.subscription = this.dataService.get(uri, this.token, this.userId).subscribe(response => {
      this.user = {...response};
      this.loader.hideLoader();
    });
  }

}
