import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalLoaderService {
  loaderVisible: boolean = false;
  lgaLoader = false;
  
  constructor() { }

  showLoader(): void {
    this.loaderVisible = true;
  }

  hideLoader(): void {
    this.loaderVisible = false;
  }
}
