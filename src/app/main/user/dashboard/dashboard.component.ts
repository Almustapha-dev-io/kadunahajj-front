import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  name = sessionStorage.getItem('name');
  role = sessionStorage.getItem('roleName');

  constructor() { }

  ngOnInit(): void {
  }

  get isAdmin() {
    return this.role === 'super-admin';
  }

  get isInitiator() {
    return this.role === 'initiator';
  }

  get isUserAdmin() {
    return this.role === 'admin';
  }

  get isReviewer() {
    return this.role === 'reviewer';
  }

}
