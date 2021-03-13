import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuardsService {

  isLoggedIn = false;
  isSuperAdmin = false;
  isInitiator = false;
  isUserAdmin = false;
  isReviewer = false;

  constructor() { }

  reset() {
    this.isLoggedIn = false;
    this.isSuperAdmin = false;
    this.isInitiator = false;
    this.isUserAdmin = false;
    this.isReviewer = false;
  }
}
