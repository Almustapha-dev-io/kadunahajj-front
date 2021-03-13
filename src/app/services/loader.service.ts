import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loaderVisible: boolean = false;

  mainLoader: boolean = false;

  constructor() { }

  showLoader(): void {
    this.loaderVisible = true;
  }

  hideLoader(): void {
    this.loaderVisible = false;
  }
}

// ^([a-zA-Z]+)[.]([a-zA-Z]+)$
