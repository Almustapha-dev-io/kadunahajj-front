import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  private get Toast() {
    return Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  successToast(message?) {
    this.Toast.fire({
      icon: 'success',
      title: ' ',
      text: message? message : 'Success'
    });
  }

  errorToast(message?) {
    this.Toast.fire({
      icon: 'error',
      title: ' ',
      text: message? message : 'Error',
      timer: 0
    });
  }

  prompt(message) {
    return Swal.fire({
      icon: 'question',
      html: message,
      showCancelButton: true,
      customClass: {
        popup: 'swal-wide',
        confirmButton: 'magnifyText',
        cancelButton: 'magnifyText'
      },
      confirmButtonText: 'Continue'
    });
  }

  alert(message) {
    return Swal.fire({
      icon: 'info',
      html: message,
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-wide',
        confirmButton: 'magnifyText'
      },
      confirmButtonText: 'Continue'
    });
  }

  input(message) {
    return Swal.fire({
      html: message,
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-wide',
        confirmButton: 'magnifyText'
      },
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Continue',
    });
  }
}
