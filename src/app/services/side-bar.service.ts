import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  sidebarFolded = false;
  active = true;

  constructor() { }

  toggleSidebarFolded() {
    this.sidebarFolded = !this.sidebarFolded;
  }

  toggleActive() {
    this.active = !this.active;
  }
}
